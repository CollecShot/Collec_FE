import * as MediaLibrary from "expo-media-library";
import { useEffect, useState } from "react";

export default function usePollingScreenshots(deviceRegisterTs: number) {
  const [screenshots, setScreenshots] = useState<MediaLibrary.Asset[]>([]);

  useEffect(() => {
    let isMounted = true;

    const fetchScreenshots = async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") return;

      const allAlbums = await MediaLibrary.getAlbumsAsync();
      const screenshotAlbum =
        allAlbums.find((a) => ["Screenshots", "스크린샷"].includes(a.title)) || null;
      if (!screenshotAlbum) return;

      // createdAfter: ms 단위로 필터링
      const resp = await MediaLibrary.getAssetsAsync({
        album: screenshotAlbum,
        mediaType: ["photo"],
        sortBy: [MediaLibrary.SortBy.creationTime],
        first: 100,
        createdAfter: deviceRegisterTs * 1000, // deviceRegisterTs가 초 단위라 ms로 변환
      });

      console.log(`[Screenshots] 총 자산 개수: ${resp.assets.length}`);
      resp.assets.forEach((asset) => {
        // asset.creationTime은 초 단위 Unix timestamp
        const ts = asset.creationTime;
        const date = new Date(ts * 1000);
        console.log(`[Screenshots] id=${asset.id} raw=${ts} → date=${date.toLocaleString()}`);
        console.log(
          `[Screenshots] 사진 정보 id=${asset.id}  filename=${asset.filename}  uri=${asset.uri}`,
        );
      });

      if (!isMounted) return;
      setScreenshots(resp.assets);
    };

    fetchScreenshots();
    const interval = setInterval(fetchScreenshots, 5000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [deviceRegisterTs]);

  return screenshots;
}
