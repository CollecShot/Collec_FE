import BackIcon from "@assets/icons/Back.svg";
import { Headline1 } from "@themes/typography";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { HeaderContainer } from "../_common/styled";

const SearchHeader: React.FC<{}> = () => {
  const router = useRouter();
  const headerTitle = "검색";

  return (
    <HeaderContainer>
      <TouchableOpacity onPress={() => router.back()}>
        <BackIcon />
      </TouchableOpacity>
      <Title>{headerTitle}</Title>
      <View style={{ width: 26 }} />
    </HeaderContainer>
  );
};

export default SearchHeader;

const Title = styled(Headline1)`
  color: ${({ theme }) => theme.colors.red[100]};
`;
