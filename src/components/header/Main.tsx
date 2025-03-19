import LogoIcon from "@assets/icons/logo.svg";
import SearchIcon from "@assets/icons/search.svg";
import TrashIcon from "@assets/icons/trash.svg";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export default function MainHeader({ navigation, back }: NativeStackHeaderProps) {
  return (
    <Container>
      <TouchableOpacity onPress={() => console.log("Trash icon pressed")}>
        <TrashIcon />
      </TouchableOpacity>
      <LogoIcon />
      <TouchableOpacity onPress={() => console.log("Search icon pressed")}>
        <SearchIcon />
      </TouchableOpacity>
    </Container>
  );
}

const Container = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 19px 18px;
  height: 56px;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;
