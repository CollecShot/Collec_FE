import { classifyPhoto } from "@/src/apis/postClassify";
import { uploadPhotoMultipart } from "@/src/apis/postPhotos";
import { getOrCreateDeviceId } from "@/src/utils/deviceId";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as MediaLibrary from "expo-media-library";
import { useEffect, useRef, useState } from "react";
const STORAGE_KEY = "@processed_screenshot_ids";

export default function usePollingScreenshots(deviceRegisterTs: number) {
  const [screenshots, setScreenshots] = useState<MediaLibrary.Asset[]>([]);
  const processedIds = useRef<Set<string>>(new Set());

  // 로컬 저장소에서 이미 처리된 ID 로드
  useEffect(() => {
    (async () => {
      const json = await AsyncStorage.getItem(STORAGE_KEY);
      if (json) {
        try {
          processedIds.current = new Set(JSON.parse(json));
        } catch {}
      }
    })();
  }, []);

  useEffect(() => {
    let isMounted = true;

    const fetchAndUpload = async () => {
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
      if (!isMounted) return;
      setScreenshots(resp.assets);

      const deviceUID = await getOrCreateDeviceId();

      for (const asset of resp.assets) {
        if (processedIds.current.has(asset.id)) continue;

        let uploaded = false;
        try {
          // 1) 업로드 시도
          const uploadRes = await uploadPhotoMultipart(asset);
          uploaded = true;
          console.log(
            `[usePollingScreenshots] upload success for id ${asset.id}, photoId ${uploadRes.data.photoId}`,
          );

          // 2) 분류 시도
          try {
            await classifyPhoto({ photoId: uploadRes.data.photoId, deviceUID });
            console.log(
              `[usePollingScreenshots] classify success for photoId ${uploadRes.data.photoId}`,
            );
          } catch (err: any) {
            if (err.response?.status === 404) {
              console.warn(
                `[usePollingScreenshots] classify 404 ignored for photoId ${uploadRes.data.photoId}`,
              );
            } else {
              console.error(
                `[usePollingScreenshots] classify error for photoId ${uploadRes.data.photoId}:`,
                err,
              );
            }
          }

          // 처리 완료
          processedIds.current.add(asset.id);
          await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(Array.from(processedIds.current)));
        } catch (err) {
          if (!uploaded) {
            console.error(`[usePollingScreenshots] upload error for id ${asset.id}:`, err);
          }
          // 업로드 실패 시 processedIds에 추가하지 않음, 다음에 재시도
        }
      }
    };

    fetchAndUpload();
    const interval = setInterval(fetchAndUpload, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [deviceRegisterTs]);

  return screenshots;
}
