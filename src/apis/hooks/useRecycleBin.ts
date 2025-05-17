import { useMutation, useQuery } from "@tanstack/react-query";
import {
  fetchRecycleBinAlbum,
  movePhotosRecycleBin,
  MoveRecycleBinResponse,
  RecycleBinAlbumPayload,
} from "../recycleBinAlbum";

// GET 휴디통 이미지 리스트트
export const useRecycleBinPhotos = () => {
  return useQuery({
    queryKey: ["recycleBinPhotos"],
    queryFn: fetchRecycleBinAlbum,
  });
};

// POST 휴지통 이동
export const useMovePhotosRecycleBin = () => {
  return useMutation({
    mutationFn: (payload: RecycleBinAlbumPayload) =>
      movePhotosRecycleBin(payload).then((res) => res.data),

    onSuccess: (_data: MoveRecycleBinResponse, variables) => {},

    onError: (error) => {
      console.error("휴지통 이동 실패:", error);
    },
  });
};
