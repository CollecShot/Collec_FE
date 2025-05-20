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

  // 1) Load previously processed IDs from AsyncStorage
  useEffect(() => {
    (async () => {
      try {
        const json = await AsyncStorage.getItem(STORAGE_KEY);
        if (json) {
          processedIds.current = new Set(JSON.parse(json));
        }
      } catch (e) {
        console.warn("Failed to load processed IDs", e);
      } finally {
        setReady(true);
      }
    })();
  }, []);

  // 2) Define fetch & upload logic
  const fetchAndUpload = useCallback(async () => {
    if (!ready) return;

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
        try {
          await classifyPhoto({ photoId: uploadRes.data.photoId, deviceUID });
          console.log(`[useGetScreenshots] classify success for photoId ${uploadRes.data.photoId}`);
        } catch (err: any) {
          if (err.response?.status === 404) {
            console.warn(
              `[useGetScreenshots] classify 404 ignored for photoId ${uploadRes.data.photoId}`,
            );
          } else {
            console.error(
              `[useGetScreenshots] classify error for photoId ${uploadRes.data.photoId}:`,
              err,
            );
          }
        }
        // Mark as processed and persist
        processedIds.current.add(asset.id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(processedIds.current)));

        // Invalidate albums query so UI updates
        queryClient.invalidateQueries(["userAlbums"]);
      } catch (err) {
        console.error(`[useGetScreenshots] failed for id ${asset.id}:`, err);
      }
    }
  }, [deviceRegisterTs, ready]);

  // 3) Invoke on mount and allow manual refresh
  useEffect(() => {
    fetchAndUpload();
  }, [fetchAndUpload]);

  return { screenshots, refetch: fetchAndUpload };
}
