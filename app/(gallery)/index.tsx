import { usePhotosByAlbums } from "@/src/apis/hooks/usePhotosByAlbums";
import Overlay from "@/src/components/_common/Overlay";
import TrashConfirmModal from "@/src/components/_common/modal/TrashConfirm";
import SelectSection from "@/src/components/gallery/SelectSection";
import { ROUTES } from "@/src/constants/routes";
import usePinchToZoom from "@hooks/usePinchToZoom";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import styled from "styled-components/native";

const Gallery: React.FC = () => {
  const { categoryId: rawId } = useLocalSearchParams<{ categoryId: string }>();
  const albumId = Number(rawId);
  const { data: photos, isLoading, error } = usePhotosByAlbums(albumId);

  const { numColumns, handlePinch } = usePinchToZoom();
  const [menuVisible, setMenuVisible] = useState(false);
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectMode, setSelectMode] = useState<"trash" | "move" | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const handleImagePress = (id: string, uri: string) => {
    if (!selectMode) {
      router.push({ pathname: ROUTES.DETAIL, params: { uri } });
      return;
    }
    setSelectedImages((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const handleSelectMode = (mode: "trash" | "move") => {
    setSelectMode(mode);
    setMenuVisible(false);
  };

  const handleComplete = () => {
    if (!selectMode) return;
    if (selectMode === "trash") setShowConfirmModal(true);
    else {
      console.log("파일 이동 완료:", selectedImages);
      resetSelection();
    }
  };

  const confirmTrash = () => {
    console.log("휴지통 이동 확정:", selectedImages);
    // TODO: API 호출
    resetSelection();
  };

  const resetSelection = () => {
    setSelectMode(null);
    setSelectedImages([]);
    setShowConfirmModal(false);
  };

  const closeMenu = () => setMenuVisible(false);

  // 로딩 / 에러 처리
  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }
  if (error) {
    return <Text>사진을 불러오는 중 오류가 발생했습니다.</Text>;
  }

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
                data={photos}
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
