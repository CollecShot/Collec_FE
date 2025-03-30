import TrashConfirmModal from "@/src/components/_common/modal/TrashConfirm";
import SelectSection from "@/src/components/gallery/SelectSection";
import usePinchToZoom from "@hooks/usePinchToZoom";
import React, { useState } from "react";
import { FlatList, Image, TouchableWithoutFeedback, View } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import styled from "styled-components/native";

const dummyImages = Array.from({ length: 20 }, (_, i) => ({
  id: i.toString(),
  uri:
    i === 0
      ? "https://i.ibb.co/XrpFsL4N/Kakao-Talk-20250221-124721479-02-1.png"
      : "https://i.ibb.co/d0pzY04N/Rectangle-16.png",
}));

const Gallery: React.FC = () => {
  const { numColumns, handlePinch } = usePinchToZoom();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState<"trash" | "move" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleImagePress = (id: string) => {
    if (!selectMode) {
      // 일반 모드: 상세 화면 이동 (예시)
      console.log("상세 화면 이동:", id);
      return;
    }
    // 선택 모드: 선택 토글
    setSelectedImages((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectMode = (mode: "trash" | "move") => {
    setSelectMode(mode);
    setMenuVisible(false);
  };

  const handleComplete = () => {
    if (!selectMode) return;
    if (selectMode === "trash") {
      setShowConfirmModal(true);
    } else {
      console.log("파일 이동 완료:", selectedImages);
      resetSelection();
    }
  };

  const confirmTrash = () => {
    console.log("휴지통 이동 확정:", selectedImages);
    // API 호출 등 처리
    resetSelection();
  };

  const resetSelection = () => {
    setSelectMode(null);
    setSelectedImages([]);
    setShowConfirmModal(false);
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
              />
              <FlatList
                data={dummyImages}
                key={numColumns}
                numColumns={numColumns}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => {
                  const isSelected = selectedImages.includes(item.id);
                  return (
                    <ImageWrapper numColumns={numColumns} onPress={() => handleImagePress(item.id)}>
                      {/* 선택된 경우만 overlay를 내부 inset으로 표시 */}
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

      <TrashConfirmModal
        visible={showConfirmModal}
        count={selectedImages.length}
        showStar
        onCancel={resetSelection}
        onConfirm={confirmTrash}
      />
    </>
  );
};

export default Gallery;

const Container = styled.View`
  flex: 1;
  background-color: #fff;
  padding: 10px;
`;

//TODO: 3px 상수화
const ImageWrapper = styled.TouchableOpacity<{ numColumns: number }>`
  width: ${({ numColumns }) => 100 / numColumns}%;
  aspect-ratio: 1;
  padding: 3px;
  position: relative;
  overflow: hidden;
`;

const Overlay = styled.View`
  position: absolute;
  top: 3px;
  left: 3px;
  right: 3px;
  bottom: 3px;
  border-width: 1.5px;
  border-color: #fc4646;
  background-color: #fc464626;
  z-index: 1;
`;
