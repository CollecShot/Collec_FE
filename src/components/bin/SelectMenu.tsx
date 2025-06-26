import { DropdownItem, dropdownItems, DropdownMode } from "@constants/dropdownItems";
import { Body2 } from "@themes/typography";
import { Fragment } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";

interface SelectMenuProps {
  onSelectMode: (mode: DropdownMode) => void;
  width?: string;
}

const SelectMenu: React.FC<SelectMenuProps> = ({ onSelectMode, width = "70%" }) => {
  const filteredItems = dropdownItems.filter(
    (item) => item.mode === "delete" || item.mode === "restore",
  );

  return (
    <MenuContainer width={width}>
      {filteredItems.map((item: DropdownItem, index: number) => (
        <Fragment key={index}>
          <MenuItemButton onPress={() => onSelectMode(item.mode)}>
            <Body2>{item.label}</Body2>
            <item.icon style={item.mode === "delete" ? { marginRight: 2 } : {}} />
          </MenuItemButton>
          {index < filteredItems.length - 1 && <Divider />}
        </Fragment>
      ))}
    </MenuContainer>
  );
};

export default SelectMenu;

const MenuContainer = styled.View<{ width: string }>`
  position: absolute;
  top: 35px;
  right: 10px;
  width: ${({ width }) => width};
  background-color: #ffffffd9;
  border: 0.8px solid #8e8e8e;
`;

const MenuItemButton = styled(TouchableOpacity)`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
`;

const Divider = styled.View`
  height: 0.8px;
  background-color: #8e8e8e;
`;
