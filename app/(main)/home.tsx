// src/screens/HomeScreen.tsx
import { useUserAlbums } from "@/src/apis/hooks/useUserAlbums";
import Grid from "@/src/components/category/Grid";
import { ALBUM_NAME_TO_KEY, CATEGORY_TITLES } from "@/src/constants/categories";
import { ROUTES } from "@/src/constants/routes";
import { useCurrentFolder } from "@/src/contexts/CurrentFolderContext";
import { useGetScreenshots } from "@/src/hooks/useGetScreenshots";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, Image, RefreshControl, ScrollView, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const windowHeight = Dimensions.get("window").height;

export default function HomeScreen() {
  // ——— Hooks at the top ———
  const { setCurrentFolderId } = useCurrentFolder();
  const { data: albums = [], isLoading, isError, refetch: refetchAlbums } = useUserAlbums();
  const [deviceTs, setDeviceTs] = useState<number>(0);
  const { screenshots, refetch: refetchScreenshots } = useGetScreenshots(deviceTs);
  const [refreshing, setRefreshing] = useState(false);

  // ——— Load or initialize deviceTs ———
  useEffect(() => {
    (async () => {
      const tsStr = await AsyncStorage.getItem("deviceRegisterTs");
      if (tsStr) {
        setDeviceTs(Number(tsStr));
      } else {
        const now = Math.floor(Date.now() / 1000);
        await AsyncStorage.setItem("deviceRegisterTs", now.toString());
        setDeviceTs(now);
      }
    })();
  }, []);

  // ——— Pull-to-refresh handler ———
  const onRefresh = async () => {
    setRefreshing(true);
    await refetchAlbums();
    await refetchScreenshots();
    setRefreshing(false);
  };

  // ——— Early returns after hooks ———
  if (isLoading) {
    return null; // or a loader
  }
  if (isError) {
    return (
      <Center>
        <RetryButton onPress={() => refetchAlbums()}>
          <StatusText>다시 시도</StatusText>
        </RetryButton>
      </Center>
    );
  }

  // ——— Transform albums into your categories UI ———
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
  const categories = albums.map((a) => {
    const key = ALBUM_NAME_TO_KEY[a.albumName]!;
    return {
      id: a.albumId.toString(),
      key,
      title: CATEGORY_TITLES[key],
      imageUri: a.latestPhotoFilepath,
      count: a.photoCount,
    };
  });
  const orderedCategories = categories.sort(
    (a, b) => CATEGORY_ORDER.indexOf(a.key) - CATEGORY_ORDER.indexOf(b.key),
  );

  const handlePressItem = (cat: (typeof categories)[0]) => {
    setCurrentFolderId(cat.id);
    router.push({
      pathname: ROUTES.GALLERY,
      params: { categoryId: cat.id },
    });
  };

  // ——— Render ———
  return (
    <ScreenContainer>
      {/* z-index 때문에 먼저 호출 */}
      <ImageContainer>
        <WebPImage source={require("@assets/images/home/home.webp")} resizeMode="contain" />
      </ImageContainer>
      <ScrollView
        contentContainerStyle={{ flex: 1 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <GridContainer>
          <Grid data={orderedCategories} onPressItem={handlePressItem} />
        </GridContainer>
      </ScrollView>

      {/* <TestButton onPress={() => router.push("/test-screenshots")}>
        <TestButtonText>스크린샷 테스트 화면</TestButtonText>
      </TestButton> */}
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
  z-index: 0;
`;
const WebPImage = styled(Image)`
  width: 100%;
`;
