import api from "./instance";

export interface MovePhotoPayload {
  photoId: number;
  targetedAlbumId: number;
}

export interface MovePhotoResponseData {
  photoId: number;
  targetedAlbumId: number;
}

export interface MovePhotoResponse {
  status: number;
  message: string;
  data: MovePhotoResponseData;
}

export const movePhotos = (payload: MovePhotoPayload) => {
  return api.post<MovePhotoResponse>("/album/move-photo", payload);
};
