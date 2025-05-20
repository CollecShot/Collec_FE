// src/apis/postPhotos.ts
import { getOrCreateDeviceId } from "@/src/utils/deviceId";
import RNFetchBlob from "rn-fetch-blob";
// ① install & import the manipulator
import * as ImageManipulator from "expo-image-manipulator";

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

  console.log(`[uploadPhotoMultipart] original URI = ${asset.uri}`);

  // 2) compress the image before uploading
  //    you can tweak compress (0–1) and resize to your needs
  const manipResult = await ImageManipulator.manipulateAsync(
    asset.uri,
    [
      // optional: resize if you want max dimensions
      // { resize: { width: 1080 } }
    ],
    {
      compress: 0.7, // 70% quality
      format: ImageManipulator.SaveFormat.JPEG,
      base64: false,
    },
  );

  console.log("[uploadPhotoMultipart] compressed URI =", manipResult.uri);

  // 3) strip file:// on Android
  const filePath = manipResult.uri.startsWith("file://")
    ? manipResult.uri.replace(/^file:\/\//, "")
    : manipResult.uri;
  const fileExt = filePath.split(".").pop()!.toLowerCase();

  const url = `${process.env.EXPO_PUBLIC_API_URL}/photo/upload`;

  // 4) rn-fetch-blob fetch 호출 with the compressed path
  const resp = await RNFetchBlob.fetch("POST", url, { "Content-Type": "multipart/form-data" }, [
    {
      name: "metadata",
      data: JSON.stringify(metadataObj),
      type: "application/json",
    },
    {
      name: "image",
      filename: `screenshot.${fileExt}`,
      type: `image/${fileExt === "jpg" ? "jpeg" : fileExt}`,
      data: RNFetchBlob.wrap(filePath),
    },
  ]);

  // 5) response logging
  console.log("[uploadPhotoMultipart] response status:", resp.info().status);
  const status = resp.info().status;
  const text = await resp.text();

  if (status >= 200 && status < 300) {
    try {
      const result = resp.json();
      console.log("[uploadPhotoMultipart] success:", result);
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
