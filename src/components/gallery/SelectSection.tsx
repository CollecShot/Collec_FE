import { Body4 } from "@themes/typography";
import styled from "styled-components/native";
import SelectMenu from "./SelectMenu";

interface SelectSectionProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  onSelectMode: (mode: "trash" | "move") => void;
  selectMode: "trash" | "move" | null;
  onComplete: () => void;
}

const SelectSection: React.FC<SelectSectionProps> = ({
  menuVisible,
  setMenuVisible,
  onSelectMode,
  selectMode,
  onComplete,
}) => {
  return (
    <Container>
      <SelectButton
        onPress={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          if (selectMode) {
            // 이미 선택 모드라면 "완료" 버튼 역할
            onComplete();
          } else {
            // 평상시 메뉴 토글
            setMenuVisible(!menuVisible);
          }
        }}
      >
        {selectMode ? <RedText>완료</RedText> : <Body4>선택하기</Body4>}
      </SelectButton>
      {menuVisible && <SelectMenu onSelectMode={onSelectMode} />}
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

const RedText = styled(Body4)`
  color: ${({ theme }) => theme.colors.red[100]};
`;
