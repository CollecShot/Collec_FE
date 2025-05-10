import { fetchPhotosByAlbum, Photo } from "@/src/apis/getPhotosByAlbums";
import { useQuery } from "@tanstack/react-query";

export const usePhotosByAlbums = (albumId: number) =>
  useQuery<Photo[], Error>({
    queryKey: ["photosByAlbum", albumId],
    queryFn: () => fetchPhotosByAlbum(albumId),
    select: (data) =>
      // 복사 후 내림차순 정렬
      data.slice().sort((a, b) => b.photoId - a.photoId),
  });
