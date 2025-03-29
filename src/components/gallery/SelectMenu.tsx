import { Body2 } from "@/src/themes/typography";
import MoveFileIcon from "@assets/icons/moveFile.svg";
import TrashIcon from "@assets/icons/trashGrey.svg";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

const SelectMenu: React.FC = () => {
  return (
    <MenuContainer>
      <MenuItem>
        <Body2>휴지통 이동</Body2>
        <TrashIcon style={{ marginRight: 2 }} />
      </MenuItem>
      <Divider />
      <MenuItem>
        <Body2>파일 이동</Body2>
        <MoveFileIcon />
      </MenuItem>
    </MenuContainer>
  );
};

export default SelectMenu;

const MenuContainer = styled.View`
  position: absolute;
  top: 35px;
  right: 10px;
  width: 70%;
  background-color: #ffffffd9;
  border: 0.8px solid #8e8e8e;
`;

const MenuItem = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
`;

const Divider = styled.View`
  height: 0.8px;
  background-color: #8e8e8e;
`;
