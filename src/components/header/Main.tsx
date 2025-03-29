import LogoIcon from "@assets/icons/logo.svg";
import SearchIcon from "@assets/icons/search.svg";
import TrashIcon from "@assets/icons/trash.svg";
import { NativeStackHeaderProps } from "@react-navigation/native-stack";
import { TouchableOpacity } from "react-native";
import { HeaderContainer } from "../_common/styled";

export default function MainHeader({ navigation, back }: NativeStackHeaderProps) {
  return (
    <HeaderContainer>
      <TouchableOpacity onPress={() => console.log("Trash icon pressed")}>
        <TrashIcon />
      </TouchableOpacity>
      <LogoIcon />
      <TouchableOpacity onPress={() => console.log("Search icon pressed")}>
        <SearchIcon />
      </TouchableOpacity>
    </HeaderContainer>
  );
}
