import { ROUTES } from "@/src/constants/routes";
import { Body4 } from "@themes/typography";
import { router } from "expo-router";
import styled from "styled-components/native";
import SelectMenu from "./SelectMenu";

interface SelectSectionProps {
  menuVisible: boolean;
  setMenuVisible: (visible: boolean) => void;
  onSelectMode: (mode: "trash" | "move") => void;
  selectMode: "trash" | "move" | null;
  onComplete: () => void; // trash 모드일 때 완료 시 호출 (모달 등)
  selectedPhotos?: any[]; // 선택된 사진 배열 (move 모드에서 전달)
}

const SelectSection: React.FC<SelectSectionProps> = ({
  menuVisible,
  setMenuVisible,
  onSelectMode,
  selectMode,
  onComplete,
  selectedPhotos,
}) => {
  return (
    <Container>
      <SelectButton
        onPress={(e: { stopPropagation: () => void }) => {
          e.stopPropagation();
          if (selectMode) {
            if (selectMode === "move") {
              // move 모드일 경우 선택된 사진들을 (move)/index로 전달하며 이동
              router.push({
                pathname: ROUTES.MOVE_FILE,
                params: { selectedPhotos: JSON.stringify(selectedPhotos) },
              });
            } else {
              // trash 모드라면 완료 로직 실행 (예: 휴지통 이동 모달 표시)
              onComplete();
            }
          } else {
            // 일반 모드일 때 메뉴 토글
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
