import { DropdownMode } from "@/src/constants/dropdownItems";
import { Body4 } from "@themes/typography";
import styled from "styled-components/native";
import SelectMenu from "./SelectMenu";

interface SelectSectionProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  onSelectMode: (mode: DropdownMode) => void;
  selectMode: DropdownMode | null;
  onComplete: () => void;
  selectedPhotos?: any[];
  onEmptyAll: () => void;
  hideEmptyAll: boolean;
}

const SelectSection: React.FC<SelectSectionProps> = ({
  menuVisible,
  setMenuVisible,
  onSelectMode,
  selectMode,
  onComplete,
  selectedPhotos,
  onEmptyAll,
  hideEmptyAll,
}) => {
  return (
    <Container>
      <TrashButton onPress={onEmptyAll}>
        {selectMode || hideEmptyAll ? null : <RedText>모두 비우기</RedText>}
      </TrashButton>
      <SelectButton
        onPress={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          if (selectMode) {
            onComplete();
          } else {
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
  flex-direction: row;
  justify-content: space-between;
  padding: 0 5.5px;
  margin-top: -10px;
  padding-bottom: 10px;
  background-color: ${({ theme }) => theme.colors.white[100]};
  z-index: 10;
`;

const TrashButton = styled.TouchableOpacity``;

const SelectButton = styled.TouchableOpacity``;

const RedText = styled(Body4)`
  color: ${({ theme }) => theme.colors.red[100]};
`;
