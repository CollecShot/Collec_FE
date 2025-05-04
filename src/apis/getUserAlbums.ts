import { getOrCreateDeviceId } from "@utils/deviceId";
import api from "./instance";

export type UserAlbum = {
  albumId: number;
  albumName: string;
  latestPhotoFilepath: string | null;
  count: number;
};

export async function fetchUserAlbums(): Promise<UserAlbum[]> {
  const deviceUID = await getOrCreateDeviceId();

  const { data } = await api.get<Omit<UserAlbum, "count">[]>("/user-albums", {
    params: { deviceUID },
  });
  return data.map((a) => ({ ...a, count: 0 })); // TODO: count 백엔드 추가되면 수정
}
