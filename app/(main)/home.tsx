import { useCurrentFolder } from "@/src/contexts/CurrentFolderContext";
import Grid from "@components/category/Grid";
import { dummyCategories } from "@constants/dummyData";
import { ROUTES } from "@constants/routes";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Image, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const windowHeight = Dimensions.get("window").height;

export default function HomeScreen() {
  const { setCurrentFolderId } = useCurrentFolder();

  // (기존) 디바이스 등록 ts 로드
  const [deviceRegisterTs, setDeviceRegisterTs] = useState<number>(0);
  useEffect(() => {
    (async () => {
      const ts = await AsyncStorage.getItem("deviceRegisterTs");
      if (ts) setDeviceRegisterTs(Number(ts));
      else {
        const now = Math.floor(Date.now() / 1000);
        await AsyncStorage.setItem("deviceRegisterTs", now.toString());
        setDeviceRegisterTs(now);
      }
    })();
  }, []);

  const handlePressItem = (category: { id: string }) => {
    setCurrentFolderId(category.id);
    router.push({
      pathname: ROUTES.GALLERY,
      params: { categoryId: category.id },
    });
  };

  return (
    <ScreenContainer>
      <GridContainer>
        <Grid data={dummyCategories} onPressItem={handlePressItem} />
      </GridContainer>
      {/* 테스트용 스크린샷 화면으로 이동하는 버튼 */}
      <TestButton onPress={() => router.push("/test-screenshots")}>
        <TestButtonText>스크린샷 테스트 화면</TestButtonText>
      </TestButton>
      <ImageContainer>
        <WebPImage source={require("@assets/images/home/home.webp")} resizeMode="contain" />
      </ImageContainer>
    </ScreenContainer>
  );
}

const ScreenContainer = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

// 테스트 버튼
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

const GridContainer = styled.View`
  flex: 1;
  z-index: 100;
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
