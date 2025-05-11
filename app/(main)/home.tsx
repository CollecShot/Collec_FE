import { useUserAlbums } from "@/src/apis/hooks/useUserAlbums";
import Grid from "@/src/components/category/Grid";
import { ALBUM_NAME_TO_KEY, CATEGORY_TITLES } from "@/src/constants/categories";
import { ROUTES } from "@/src/constants/routes";
import { useCurrentFolder } from "@/src/contexts/CurrentFolderContext";
import { router } from "expo-router";
import React from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const windowHeight = Dimensions.get("window").height;

export default function HomeScreen() {
  const { setCurrentFolderId } = useCurrentFolder();
  const { data: albums = [], isLoading, isError, refetch } = useUserAlbums();

  // 1) 로딩 상태
  if (isLoading) {
    return;
  }

  // 2) 에러 상태
  if (isError) {
    return (
      <Center>
        <RetryButton onPress={() => refetch()}>
          <StatusText>다시 시도</StatusText>
        </RetryButton>
      </Center>
    );
  }

  const CATEGORY_ORDER = [
    "shopping",
    "document",
    "reservation",
    "location",
    "coupon",
    "chat",
    "music",
    "animal",
    "person",
    "etc",
  ];

  const categories = albums.map((a) => ({
    id: a.albumId.toString(),
    key: ALBUM_NAME_TO_KEY[a.albumName]!,
    title: CATEGORY_TITLES[ALBUM_NAME_TO_KEY[a.albumName]!],
    imageUri: a.latestPhotoFilepath,
    count: a.photoCount,
  }));

  // 순서대로 렌더링
  const orderedCategories = categories.sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.key.toString()) - CATEGORY_ORDER.indexOf(b.key.toString()),
  );

  const handlePressItem = (category: (typeof categories)[0]) => {
    setCurrentFolderId(category.id);
    router.push({
      pathname: ROUTES.GALLERY,
      params: { categoryId: category.id },
    });
  };

  return (
    <ScreenContainer>
      <GridContainer>
        <Grid data={orderedCategories} onPressItem={handlePressItem} />
      </GridContainer>

      <TestButton onPress={() => router.push("/test-screenshots")}>
        <TestButtonText>스크린샷 테스트 화면</TestButtonText>
      </TestButton>

      <ImageContainer>
        <WebPImage source={require("@assets/images/home/home.webp")} resizeMode="contain" />
      </ImageContainer>
    </ScreenContainer>
  );
}

const Center = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const StatusText = styled.Text`
  font-size: 16px;
  color: #000;
`;

const RetryButton = styled(TouchableOpacity)`
  padding: 10px 20px;
  background-color: #ff3b30;
  border-radius: 6px;
`;

const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const GridContainer = styled.View`
  flex: 1;
  z-index: 100;
`;

const TestButton = styled(TouchableOpacity)`
  padding: 10px 16px;
  background-color: #007aff;
  align-self: center;
  border-radius: 6px;
  margin: 12px 0;
  z-index: 100;
`;

const TestButtonText = styled.Text`
  color: white;
  font-size: 14px;
  font-weight: bold;
`;

const ImageContainer = styled.View`
  position: absolute;
  left: 0;
  right: 0;
  bottom: 0;
  height: ${windowHeight * 0.8}px;
`;

const WebPImage = styled(Image)`
  width: 100%;
`;
