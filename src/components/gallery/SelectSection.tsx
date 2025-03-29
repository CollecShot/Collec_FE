import { Body4 } from "@/src/themes/typography";
import styled from "styled-components/native";
import SelectMenu from "./SelectMenu";

interface SelectSectionProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
}

const SelectSection: React.FC<SelectSectionProps> = ({ menuVisible, setMenuVisible }) => {
  return (
    <Container>
      <SelectButton
        onPress={(e) => {
          e.stopPropagation(); // 버튼 클릭 시 메뉴 닫히는 거 방지
          setMenuVisible(!menuVisible);
        }}
      >
        <Body4>선택하기</Body4>
      </SelectButton>

      {menuVisible && <SelectMenu />}
    </Container>
  );
};

export default SelectSection;

const Container = styled.View`
  position: relative;
  padding: 0 5.5px;
  margin-top: -10px;
  padding-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.white[100]};
  z-index: 10;
`;

const SelectButton = styled.TouchableOpacity`
  align-self: flex-end;
`;
