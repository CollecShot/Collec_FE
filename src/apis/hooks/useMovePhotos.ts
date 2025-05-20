import { MovePhotoPayload, MovePhotoResponse, movePhotos } from "@/src/apis/movePhotos";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useMovePhotos = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: MovePhotoPayload) => movePhotos(payload).then((res) => res.data),
    onSuccess: (_data: MovePhotoResponse, variables) => {
      // 이동 성공 후 사진 목록과 앨범 목록 무효화
      queryClient.invalidateQueries({ queryKey: ["photosByAlbum"], exact: false });
      queryClient.invalidateQueries({ queryKey: ["userAlbums"], exact: true });
    },
    onError: (error) => {
      console.error("Move photo failed", error);
    },
  });
};
