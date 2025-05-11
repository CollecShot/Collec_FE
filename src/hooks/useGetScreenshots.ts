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

  // load processed IDs once
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) processedIds.current = new Set(JSON.parse(json));
    })();
  }, []);

  const fetchAndUpload = useCallback(async () => {
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
        await classifyPhoto({ photoId: uploadRes.data.photoId, deviceUID });
        processedIds.current.add(asset.id);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(processedIds.current)));
        // refresh albums
        queryClient.invalidateQueries(["userAlbums"]);
      } catch {
        // ignore individual failures
      }
    }
  }, [deviceRegisterTs]);

  // call on mount
  useEffect(() => {
    fetchAndUpload();
  }, [fetchAndUpload]);

  return { screenshots, refetch: fetchAndUpload };
}
