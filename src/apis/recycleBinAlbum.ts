import { getOrCreateDeviceId } from "@utils/deviceId";
import api from "./instance";

export type RecycleBinAlbum = {
  photoId: number;
  photoFilepath: string;
};

// GET - 휴지통 이미지 리스트
export async function fetchRecycleBinAlbum(): Promise<RecycleBinAlbum[]> {
  try {
    const deviceUID = await getOrCreateDeviceId();
    const response = await api.get<{
      status: number;
      message: string;
      data: RecycleBinAlbum[];
    }>("/photo/trashes", {
      params: { deviceUID },
    });

    console.log("✅ fetchRecycleBinAlbum 성공:", response.data);
    return response.data.data; // ✅ 여기서 .data.data
  } catch (error) {
    console.error("❌ fetchRecycleBinAlbum 실패:", error);
    throw error;
  }
}

export interface RecycleBinAlbumPayload {
  photoIds: number[];
}

export interface MoveRecycleBinResponse {
  status: number;
  message: string;
}

// POST - 사진 휴지통로 이동
export const movePhotosRecycleBin = (payload: RecycleBinAlbumPayload) => {
  return api.post<MoveRecycleBinResponse>("/photo/move/trash", payload);
};
