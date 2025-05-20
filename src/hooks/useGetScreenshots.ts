// src/hooks/useGetScreenshots.ts
import { classifyPhoto } from "@/src/apis/postClassify";
import { uploadPhotoMultipart } from "@/src/apis/postPhotos";
import { queryClient } from "@/src/apis/queryClient";
import { getOrCreateDeviceId } from "@/src/utils/deviceId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";
import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "@processed_screenshot_ids";

export function useGetScreenshots(deviceRegisterTs: number) {
  const [screenshots, setScreenshots] = useState<MediaLibrary.Asset[]>([]);
  const processedIds = useRef<Set<string>>(new Set());
  const [ready, setReady] = useState(false);

  // 1) 이전에 처리한 ID 불러오기
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) processedIds.current = new Set(JSON.parse(json));
      } catch {}
      setReady(true);
    })();
  }, []);

  // 2) fetchAndUpload: ready가 true이고 deviceTs>0일 때만 실행
  const fetchAndUpload = useCallback(async () => {
    if (!ready || deviceRegisterTs <= 0) return;

    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status !== "granted") return;

    const albums = await MediaLibrary.getAlbumsAsync();
    const screenshotAlbum = albums.find((a) => ["Screenshots", "스크린샷"].includes(a.title));
    if (!screenshotAlbum) return;

    const resp = await MediaLibrary.getAssetsAsync({
      album: screenshotAlbum,
      mediaType: ["photo"],
      sortBy: [MediaLibrary.SortBy.creationTime],
      first: 100,
      createdAfter: deviceRegisterTs * 1000,
    });
    setScreenshots(resp.assets);

    const deviceUID = await getOrCreateDeviceId();
    for (const asset of resp.assets) {
      if (processedIds.current.has(asset.id)) continue;
      try {
        const uploadRes = await uploadPhotoMultipart(asset);
        // 분류 시도
        try {
          await classifyPhoto({ photoId: uploadRes.data.photoId, deviceUID });
        } catch (err: any) {
          if (err.response?.status === 404) {
            console.warn(
              `[useGetScreenshots] classify 404, ignoring photoId ${uploadRes.data.photoId}`,
            );
          } else {
            console.error(`[useGetScreenshots] classify error`, err);
          }
        }

        processedIds.current.add(asset.id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(processedIds.current)));
        queryClient.invalidateQueries(["userAlbums"]);
      } catch (e) {
        console.error(`[useGetScreenshots] upload error for ${asset.id}`, e);
      }
    }
  }, [deviceRegisterTs, ready]);

  // 3) mount 시와 refetch 시 실행
  useEffect(() => {
    fetchAndUpload();
  }, [fetchAndUpload]);

  return { screenshots, refetch: fetchAndUpload };
}
