import BackIcon from "@assets/icons/Back.svg";
import { Headline1 } from "@themes/typography";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";
import { HeaderContainer } from "../_common/styled";

const MoveHeader: React.FC<{}> = () => {
  const router = useRouter();
  return (
    <HeaderContainer>
      <TouchableOpacity onPress={() => router.back()}>
        <BackIcon />
      </TouchableOpacity>
      <Title>이동할 앨범을 선택해주세요*</Title>
      <View style={{ width: 26 }} />
    </HeaderContainer>
  );
};

export default MoveHeader;

const Title = styled(Headline1)`
  color: ${({ theme }) => theme.colors.red[100]};
`;
