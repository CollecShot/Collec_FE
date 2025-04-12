import { useCurrentFolder } from "@/src/contexts/CurrentFolderContext";
import Grid from "@components/category/Grid";
import { dummyCategories } from "@constants/dummyData";
import { ROUTES } from "@constants/routes";
import { router } from "expo-router";
import { Dimensions, Image } from "react-native";
import styled from "styled-components/native";

const windowHeight = Dimensions.get("window").height; // 기기 화면 높이 가져오기

export default function HomeScreen() {
  const { setCurrentFolderId } = useCurrentFolder();

  const handlePressItem = (category: { id: string }) => {
    // 선택된 카테고리 id를 Context에 저장, params 삭제 예정
    setCurrentFolderId(category.id);
    router.push({ pathname: ROUTES.GALLERY, params: { categoryId: category.id } });
  };

  return (
    <ScreenContainer>
      <GridContainer>
        <Grid data={dummyCategories} onPressItem={handlePressItem} />
      </GridContainer>
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
