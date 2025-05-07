import { fetchPhotosByAlbum, Photo } from "@/src/apis/getPhotosByAlbums";
import { useQuery } from "@tanstack/react-query";

export const usePhotosByAlbums = (albumId: number) =>
  useQuery<Photo[], Error>({
    queryKey: ["photosByAlbum", albumId],
    queryFn: () => fetchPhotosByAlbum(albumId),
  });
