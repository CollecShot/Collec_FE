import { useCurrentFolder } from "@/src/contexts/CurrentFolderContext";
import Grid from "@components/category/Grid";
import { dummyCategories } from "@constants/dummyData";
import { ROUTES } from "@constants/routes";
import { router } from "expo-router";
import styled from "styled-components/native";

export default function HomeScreen() {
  const { setCurrentFolderId } = useCurrentFolder();

  const handlePressItem = (category: { id: string }) => {
    // 선택된 카테고리 id를 Context에 저장, params 삭제 예정
    setCurrentFolderId(category.id);
    router.push({ pathname: ROUTES.GALLERY, params: { categoryId: category.id } });
  };

  return (
    <Container>
      <Grid data={dummyCategories} onPressItem={handlePressItem} />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.white[100]};
`;
