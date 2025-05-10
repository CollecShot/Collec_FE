import { getOrCreateDeviceId } from "@utils/deviceId";
import api from "./instance";

export type UserAlbum = {
  albumId: number;
  albumName: string;
  latestPhotoFilepath: string | null;
  photoCount: number;
};

export async function fetchUserAlbums(): Promise<UserAlbum[]> {
  const deviceUID = await getOrCreateDeviceId();

  const { data } = await api.get<Omit<UserAlbum, "count">[]>("/user-albums", {
    params: { deviceUID },
  });
  return data;
}
