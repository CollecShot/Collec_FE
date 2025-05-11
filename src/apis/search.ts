// src/apis/search.ts
import { getOrCreateDeviceId } from "@utils/deviceId";
import api from "./instance";

export interface SearchPhoto {
  photoId: number;
  photoFilepath: string;
}

export const searchPhotos = async (keyword: string): Promise<SearchPhoto[]> => {
  const deviceUID = await getOrCreateDeviceId();
  const { data } = await api.get<SearchPhoto[]>("/photo/search", {
    params: { deviceUID, keyword },
  });
  return data;
};
