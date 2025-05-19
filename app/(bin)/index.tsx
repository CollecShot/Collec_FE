import { useRecycleBinPhotos, useRestorePhotos } from "@/src/apis/hooks/useRecycleBin";
import DeleteConfirmModal from "@/src/components/_common/modal/DeleteConfirm";
import RestoreConfirmModal from "@/src/components/_common/modal/RestoreConfirm";
import Overlay from "@/src/components/_common/Overlay";
import SelectSection from "@/src/components/bin/SelectSection";
import { DropdownMode } from "@/src/constants/dropdownItems";
import { ROUTES } from "@/src/constants/routes";
import usePinchToZoom from "@hooks/usePinchToZoom";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, Text, TouchableWithoutFeedback, View } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import styled from "styled-components/native";

const Bin: React.FC = () => {
  const { numColumns, handlePinch } = usePinchToZoom();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState<DropdownMode | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [hideEmptyAll, setHideEmptyAll] = useState(false);

  const { data: images, isLoading, error } = useRecycleBinPhotos();
  const { mutate: restorePhotosMutate } = useRestorePhotos();

  const handleImagePress = (id: string, uri: string) => {
    if (!selectMode) {
      router.push({ pathname: ROUTES.DETAIL, params: { uri } });
      return;
    }
    setSelectedImages((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectMode = (mode: DropdownMode) => {
    setSelectMode(mode);
    setMenuVisible(false);
    // 드롭다운 메뉴에서 옵션 선택 후 왼쪽 버튼 텍스트 감춤
    setHideEmptyAll(true);
  };

  const handleComplete = () => {
    if (!selectMode) return;
    if (selectMode === "delete") {
      setShowDeleteModal(true);
    } else if (selectMode === "restore") {
      setShowRestoreModal(true);
    }
  };

  // [모두 비우기] 버튼 클릭: 모든 이미지 선택. 여기서는 모달은 나중에 완료 버튼을 누를 때 표시.
  const handleEmptyAll = () => {
    // 여기서는 delete 모드로 처리 (원하는 delete 기능 사용)
    setSelectMode("delete");
    if (images) {
      setSelectedImages(images.map((img) => img.photoId.toString()));
    }
  };

  const resetSelection = () => {
    setSelectMode(null);
    setSelectedImages([]);
    setShowDeleteModal(false);
    setShowRestoreModal(false);
    setHideEmptyAll(false);
  };

  const closeMenu = () => {
    if (menuVisible) {
      setMenuVisible(false);
    }
  };

  if (isLoading) return <View style={{ flex: 1, backgroundColor: "#fff" }} />;
  if (error) return <Text>휴지통 이미지를 불러오는 중 오류가 발생했습니다.</Text>;

  return (
    <>
      <TouchableWithoutFeedback onPress={closeMenu} accessible={false}>
        <View style={{ flex: 1 }} onStartShouldSetResponder={() => true}>
          <PinchGestureHandler onHandlerStateChange={handlePinch}>
            <Container>
              <SelectSection
                menuVisible={menuVisible}
                setMenuVisible={setMenuVisible}
                onSelectMode={handleSelectMode}
                selectMode={selectMode}
                onComplete={handleComplete}
                selectedPhotos={selectedImages}
                onEmptyAll={handleEmptyAll}
                hideEmptyAll={hideEmptyAll}
              />
              <FlatList
                data={images}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.photoId.toString()}
                renderItem={({ item }) => {
                  const id = item.photoId.toString();
                  const isSelected = selectedImages.includes(id);
                  return (
                    <ImageWrapper
                      numColumns={numColumns}
                      onPress={() => handleImagePress(id, item.photoFilepath)}
                    >
                      {isSelected && <Overlay />}
                      <Image
                        source={{ uri: item.photoFilepath }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </ImageWrapper>
                  );
                }}
              />
            </Container>
          </PinchGestureHandler>
        </View>
      </TouchableWithoutFeedback>
      <DeleteConfirmModal
        visible={showDeleteModal}
        count={selectedImages.length}
        showStar
        onCancel={resetSelection}
        onConfirm={confirmDelete}
      />
      <RestoreConfirmModal
        visible={showRestoreModal}
        count={selectedImages.length}
        showStar
        onCancel={resetSelection}
        onConfirm={confirmRestore}
      />
    </>
  );

  function confirmDelete() {
    console.log("완전 사진 삭제:", selectedImages);
    // API 호출 등 추가 처리
    resetSelection();
  }

  function confirmRestore() {
    const photoIds = selectedImages.map((id) => parseInt(id, 10));
    restorePhotosMutate(photoIds);
    resetSelection();
  }
};

export default Bin;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 10px;
`;

const ImageWrapper = styled.TouchableOpacity<{ numColumns: number }>`
  width: ${({ numColumns }) => 100 / numColumns}%;
  aspect-ratio: 1;
  padding: 3px;
  position: relative;
  overflow: hidden;
`;
