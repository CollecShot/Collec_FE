import DeleteConfirmModal from "@/src/components/_common/modal/DeleteConfirm";
import RestoreConfirmModal from "@/src/components/_common/modal/RestoreConfirm";
import Overlay from "@/src/components/_common/Overlay";
import SelectSection from "@/src/components/bin/SelectSection";
import { DropdownMode } from "@/src/constants/dropdownItems";
import { ROUTES } from "@/src/constants/routes";
import usePinchToZoom from "@hooks/usePinchToZoom";
import { router } from "expo-router";
import { useState } from "react";
import { FlatList, Image, TouchableWithoutFeedback, View } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import styled from "styled-components/native";

// TODO: 휴지통 API 연결
const dummyImages = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  uri:
    i === 0
      ? "https://i.ibb.co/XrpFsL4N/Kakao-Talk-20250221-124721479-02-1.png"
      : "https://i.ibb.co/d0pzY04N/Rectangle-16.png",
}));

const Bin: React.FC = () => {
  const { numColumns, handlePinch } = usePinchToZoom();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState<DropdownMode | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [hideEmptyAll, setHideEmptyAll] = useState(false);

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
    setSelectedImages(dummyImages.map((img) => img.id));
    // hideEmptyAll은 드롭다운 메뉴에서 옵션 선택 시 변경되도록 함
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
                data={dummyImages}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedImages.includes(item.id);
                  return (
                    <ImageWrapper
                      numColumns={numColumns}
                      onPress={() => handleImagePress(item.id, item.uri)}
                    >
                      {isSelected && <Overlay />}
                      <Image source={{ uri: item.uri }} style={{ width: "100%", height: "100%" }} />
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
    console.log("복구 확정:", selectedImages);
    // API 호출 등 복구 관련 추가 처리
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
