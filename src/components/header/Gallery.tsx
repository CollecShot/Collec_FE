import BackIcon from "@assets/icons/Back.svg";
import { CATEGORY_TITLES } from "@constants/categories";
import { Headline1 } from "@themes/typography";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { HeaderContainer } from "../_common/styled";

const GalleryHeader: React.FC<{ categoryId: string }> = ({ categoryId }) => {
  const router = useRouter();
  const categoryTitle = CATEGORY_TITLES[categoryId] || "갤러리";

  return (
    <HeaderContainer>
      <TouchableOpacity onPress={() => router.back()}>
        <BackIcon />
      </TouchableOpacity>
      <Title>{categoryTitle}</Title>
      <View style={{ width: 26 }} />
    </HeaderContainer>
  );
};

export default GalleryHeader;

const Title = styled(Headline1)`
  color: ${({ theme }) => theme.colors.red[100]};
`;
