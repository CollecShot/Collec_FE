import { BackIcon, MenuIcon } from "@/assets/icons/_index";
import { ROUTES } from "@/src/constants/routes";
import useConfirmModal from "@/src/hooks/useConfirmModal";
import { Body2, Body5, Headline2 } from "@/src/themes/typography";
import { DropdownItem, dropdownItems, DropdownMode } from "@constants/dropdownItems";
import { useRouter } from "expo-router";
import { Fragment, useState } from "react";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import TrashConfirmModal from "../_common/modal/TrashConfirm";
import { HeaderContainer } from "../_common/styled";

const DetailHeader: React.FC = () => {
  const router = useRouter();
  const [menuVisible, setMenuVisible] = useState(false);

  // TODO: 사진 정보 (날짜, 시간) 연결
  const date = "2024년 12월 8일";
  const time = "오후 12:46";

  const handleMenuToggle = () => {
    setMenuVisible((prev) => !prev);
  };

  const {
    isVisible: trashModalVisible,
    openModal: openTrashModal,
    closeModal: closeTrashModal,
    confirm: confirmTrash,
  } = useConfirmModal(() => {
    console.log("휴지통 이동 확정");
    // API 호출 등 추가 처리 가능
  });

  const filteredItems = dropdownItems.filter(
    (item) => item.mode === "trash" || item.mode === "move" || item.mode === "info",
  );

  const handleSelect = (mode: DropdownMode) => {
    switch (mode) {
      case "trash":
        openTrashModal();
        break;
      case "move":
        router.push(ROUTES.MOVE_FILE);
        break;
      case "info":
        console.log("상세 정보 버튼 클릭");
      default:
        break;
    }
    setMenuVisible(false);
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
      </LeftSection>
      <TitleContainer>
        <Headline2 color="#FC4646">{date}</Headline2>
        <Body5 color="#AAA">{time}</Body5>
      </TitleContainer>
      <RightSection>
        <TouchableOpacity onPress={handleMenuToggle}>
          <MenuIcon />
        </TouchableOpacity>
        {menuVisible && (
          <MenuContainer>
            {filteredItems.map((item: DropdownItem, index: number) => (
              <Fragment key={index}>
                <MenuItemButton onPress={() => handleSelect(item.mode)}>
                  <Body2>{item.label}</Body2>
                  <item.icon style={item.mode !== "move" ? { marginRight: 2 } : {}} />
                </MenuItemButton>
                {index < filteredItems.length - 1 && <Divider />}
              </Fragment>
            ))}
          </MenuContainer>
        )}
      </RightSection>
      {trashModalVisible && (
        <TrashConfirmModal
          visible={trashModalVisible}
          onCancel={closeTrashModal}
          onConfirm={confirmTrash}
          count={1}
        />
      )}
    </HeaderContainer>
  );
};

export default DetailHeader;

const LeftSection = styled.View`
  width: 30%;
  align-items: flex-start;
  justify-content: center;
`;

const RightSection = styled.View`
  width: 30%;
  align-items: flex-end;
  justify-content: center;
  position: relative;
`;

const TitleContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;

const MenuContainer = styled.View`
  position: absolute;
  top: 45px;
  right: 10px;
  width: 220%;
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
