import MoveConfirmModal from "@/src/components/_common/modal/MoveConfirm";
import Grid from "@/src/components/category/Grid";
import { dummyCategories } from "@/src/constants/dummyData";
import { useCurrentFolder } from "@/src/contexts/CurrentFolderContext";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import styled from "styled-components/native";

export default function MoveFile() {
  const router = useRouter();
  // 이전 화면에서 전달된 파라미터: selectedPhotos만 사용하고,
  // 현재 폴더 id는 Context에서 가져옵니다.
  const params = useLocalSearchParams<{ selectedPhotos?: string }>();
  const { selectedPhotos } = params;

  // 선택된 사진은 JSON 문자열로 전달되었다고 가정
  const parsedPhotos = selectedPhotos ? JSON.parse(selectedPhotos) : [];
  const photoCount = parsedPhotos.length;

  // 현재 폴더 id는 Context에서 가져옴
  const { currentFolderId } = useCurrentFolder();
  console.log("현재 폴더:", currentFolderId);
  const currentFolder = dummyCategories.find((cat) => cat.id === currentFolderId);
  const currentFolderTitle = currentFolder ? currentFolder.title : "현재 폴더";

  // 사용자가 그리드에서 선택한 카테고리(대상 폴더)
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  // Grid에서 카테고리 선택 시
  const handlePressItem = (category: any) => {
    setSelectedCategory(category);
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    setSelectedCategory(null);
  };

  const handleConfirm = () => {
    // 실제 이동 로직(API 호출 등)을 이곳에서 실행
    console.log(
      `${photoCount}장의 사진을 [${currentFolderTitle}]에서 [${selectedCategory.title}]로 이동합니다.`,
    );
    setModalVisible(false);
    setSelectedCategory(null);
    // 이동 완료 후 이전 화면으로 돌아감
    router.back();
  };

  return (
    <Container>
      {/* Grid 컴포넌트는 재사용하여 카테고리 목록을 보여줍니다. */}
      <Grid data={dummyCategories} onPressItem={handlePressItem} />

      {/* 선택한 카테고리(대상 폴더)가 있으면 모달을 표시 */}
      <MoveConfirmModal
        visible={modalVisible}
        onCancel={handleCancel}
        onConfirm={handleConfirm}
        fromFolder={currentFolderTitle}
        toFolder={selectedCategory ? selectedCategory.title : ""}
        photoCount={photoCount}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;
