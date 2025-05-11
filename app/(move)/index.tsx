import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Text, View } from "react-native";
import styled from "styled-components/native";

import { useMovePhotos } from "@/src/apis/hooks/useMovePhotos";
import { useUserAlbums } from "@/src/apis/hooks/useUserAlbums";
import MoveConfirmModal from "@/src/components/_common/modal/MoveConfirm";
import Grid from "@/src/components/category/Grid";
import { ROUTES } from "@/src/constants/routes";
import { useCurrentFolder } from "@/src/contexts/CurrentFolderContext";
import { mapAlbumsToCategories, sortCategories } from "@/src/utils/albumUtil";

export default function MoveFile() {
  const router = useRouter();
  const { selectedPhotos: raw } = useLocalSearchParams<{ selectedPhotos?: string }>();
  const parsedPhotos: number[] = raw ? (JSON.parse(raw) as string[]).map((id) => Number(id)) : [];

  const { currentFolderId } = useCurrentFolder();

  // 1) 앨범 목록 가져오기
  const { data: albums = [], isLoading, isError, refetch } = useUserAlbums();

  // 2) 매핑 + 정렬
  const categories = sortCategories(mapAlbumsToCategories(albums));

  // 3) 현재 폴더 제목
  const current = categories.find((c) => c.id === currentFolderId);
  const currentTitle = current?.title ?? "현재 폴더";

  const [target, setTarget] = useState<(typeof categories)[0] | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const handlePressItem = (category: (typeof categories)[0]) => {
    setTarget(category);
    setModalVisible(true);
  };
  const handleCancel = () => {
    setModalVisible(false);
    setTarget(null);
  };

  // 단일 사진 이동 mutation
  const { mutateAsync: movePhoto, isLoading: isMoving } = useMovePhotos();

  const handleConfirm = async () => {
    if (!target) return;

    // 1) 전달된 raw, parsedPhotos 확인
    console.log("🔍 raw param:", raw);
    console.log("🔍 parsedPhotos:", parsedPhotos, "length:", parsedPhotos.length);

    try {
      // 2) mutation 호출 전 payload 확인
      await Promise.all(
        parsedPhotos.map((photoId) => {
          const payload = { photoId, targetedAlbumId: Number(target.id) };
          console.log("➡️ movePhoto payload:", payload);
          return movePhoto(payload);
        }),
      );

      console.log("✅ all movePhoto calls resolved");

      setModalVisible(false);
      setTarget(null);
      await router.replace(ROUTES.MAIN_HOME);
      router.push({
        pathname: ROUTES.GALLERY,
        params: { categoryId: target.id },
      });
    } catch (e) {
      console.error("사진 이동 실패", e);
    }
  };

  if (isLoading) {
    return <View style={{ backgroundColor: "#fff" }} />;
  }
  if (isError) {
    return (
      <Centered>
        <Text onPress={refetch}>앨범 불러오기 실패, 다시 시도</Text>
      </Centered>
    );
  }

  return (
    <Container>
      <Grid data={categories} onPressItem={handlePressItem} />

      <MoveConfirmModal
        visible={modalVisible}
        fromFolder={currentTitle}
        toFolder={target?.title ?? ""}
        photoCount={parsedPhotos.length}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        loading={isMoving}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;
