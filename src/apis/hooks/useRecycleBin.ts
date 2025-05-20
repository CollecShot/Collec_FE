import { useMutation, useQuery } from "@tanstack/react-query";
import { Alert } from "react-native";
import { queryClient } from "../queryClient";
import {
  deletePhotos,
  fetchRecycleBinAlbum,
  movePhotosRecycleBin,
  MoveRecycleBinResponse,
  RecycleBinAlbumPayload,
  restorePhotos,
} from "../recycleBinAlbum";

// GET 휴디통 이미지 리스트트
export const useRecycleBinPhotos = () => {
  return useQuery({
    queryKey: ["recycleBinPhotos"],
    queryFn: fetchRecycleBinAlbum,
    staleTime: 0,
    refetchOnMount: true,
  });
};

// POST 휴지통 이동
export const useMovePhotosRecycleBin = () => {
  return useMutation({
    mutationFn: (payload: RecycleBinAlbumPayload) =>
      movePhotosRecycleBin(payload).then((res) => res.data),

    onSuccess: (_data: MoveRecycleBinResponse, variables) => {
      // 이동 성공 후 사진 목록과 앨범 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["recycleBinPhotos"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["photosByAlbum"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["userAlbums"], exact: false });
    },

    onError: (error) => {
      console.error("휴지통 이동 실패:", error);
    },
  });
};

// POST 사진 복구
export const useRestorePhotos = () => {
  return useMutation({
    mutationFn: restorePhotos,
    onSuccess: () => {
      // 복구 후 관련 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: ["recycleBinPhotos"], exact: true });
      queryClient.invalidateQueries({ queryKey: ["photosByAlbum"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["userAlbums"], exact: true });
    },
    onError: (err) => {
      console.error("사진 복구 실패:", err);
    },
  });
};

// DELETE 사진 삭제
export const useDeletePhotos = () => {
  return useMutation({
    mutationFn: (photoIds: number[]) => deletePhotos(photoIds),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recycleBinPhotos"] });
    },
    onError: (error) => {
      console.error("삭제 실패:", error);
      Alert.alert("삭제 실패", "사진 삭제 중 오류가 발생했습니다.");
    },
  });
};
