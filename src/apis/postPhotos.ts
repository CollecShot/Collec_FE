// src/apis/postPhotos.ts
import { getOrCreateDeviceId } from "@/src/utils/deviceId";
import RNFetchBlob from "rn-fetch-blob";

export type UploadMetadata = {
  deviceUID: string;
  photoFilepath: string;
  photoDatetime: string;
};

export async function uploadPhotoMultipart(asset: {
  uri: string;
  creationTime: number;
  id: string;
}) {
  // 1) metadata 준비
  const metadataObj: UploadMetadata = {
    deviceUID: await getOrCreateDeviceId(),
    photoFilepath: asset.uri,
    photoDatetime: new Date(asset.creationTime).toISOString(),
  };

  console.log(`[uploadPhotoMultipart] asset.uri = ${asset.uri}`);

  // 2) file:// 제거 (Android)
  const filePath = asset.uri.startsWith("file://")
    ? asset.uri.replace(/^file:\/\//, "")
    : asset.uri;
  const fileExt = filePath.split(".").pop()!.toLowerCase();

  const url = `${process.env.EXPO_PUBLIC_API_URL}/photo/upload`;

  // 3) rn-fetch-blob fetch 호출
  const resp = await RNFetchBlob.fetch(
    "POST",
    url,
    {
      "Content-Type": "multipart/form-data",
    },
    [
      {
        name: "metadata", // 서버의 @RequestPart('metadata') 와 일치
        data: JSON.stringify(metadataObj),
        type: "application/json",
      },
      {
        name: "image", // 서버의 @RequestPart('image') 와 일치
        filename: `screenshot.${fileExt}`,
        type: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
        data: RNFetchBlob.wrap(filePath),
      },
    ],
  );

  // 3.1) 전송 raw response info
  console.log("[uploadPhotoMultipart] response status:", resp.info().status);

  // 4) 응답 처리
  const status = resp.info().status;
  const text = await resp.text();
  if (status >= 200 && status < 300) {
    try {
      const result = resp.json();
      console.log("[uploadPhotoMultipart] success result:", result);
      return result;
    } catch (err) {
      console.warn("[uploadPhotoMultipart] JSON parse failed", err);
      return;
    }
  } else {
    console.error("[uploadPhotoMultipart] error response text:", text);
    throw new Error(`HTTP ${status} — ${text}`);
  }
}
