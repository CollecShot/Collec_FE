import api from "./instance";

export interface Photo {
  photoId: number;
  photoFilepath: string;
}

export const fetchPhotosByAlbum = async (albumId: number): Promise<Photo[]> => {
  const { data } = await api.get<Photo[]>("/photo/albums", {
    params: { albumId },
  });
  console.log(data);
  return data;
};
