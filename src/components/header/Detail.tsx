// src/components/header/DetailHeader.tsx
import { BackIcon, MenuIcon } from "@/assets/icons/_index";
import { DropdownItem, dropdownItems, DropdownMode } from "@/src/constants/dropdownItems";
import { ROUTES } from "@/src/constants/routes";
import useConfirmModal from "@/src/hooks/useConfirmModal";
import { Body2, Body5, Headline2 } from "@/src/themes/typography";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Fragment, useEffect, useState } from "react";
import { PermissionsAndroid, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import TrashConfirmModal from "../_common/modal/TrashConfirm";
import { HeaderContainer } from "../_common/styled";

export default function DetailHeader() {
  const router = useRouter();
  const { uri, photoId: rawPhotoId } = useLocalSearchParams<{
    uri: string;
    photoId: string;
  }>();
  const photoId = Number(rawPhotoId);

  // 1) Load file’s last‐modified timestamp
  const [modTs, setModTs] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === "android") {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists && info.modificationTime) {
          setModTs(info.modificationTime * 1000);
        }
      } catch (e) {
        console.warn("getInfoAsync failed", e);
      }
    })();
  }, [uri]);

  // 2) Format date/time
  let dateLabel = "";
  let timeLabel = "";
  if (modTs) {
    const dt = new Date(modTs);
    const yyyy = dt.getFullYear();
    const MM = dt.getMonth() + 1;
    const dd = dt.getDate();
    let hh = dt.getHours();
    const mm = dt.getMinutes().toString().padStart(2, "0");
    const ampm = hh < 12 ? "오전" : "오후";
    hh = hh % 12 || 12;
    dateLabel = `${yyyy}년 ${MM}월 ${dd}일`;
    timeLabel = `${ampm} ${hh}:${mm}`;
  }

  // 3) Trash modal
  const {
    isVisible: trashModalVisible,
    openModal: openTrashModal,
    closeModal: closeTrashModal,
    confirm: confirmTrash,
  } = useConfirmModal(() => {
    console.log("휴지통 이동 확정", photoId);
    // TODO: call your trash API
  });

  // 4) Menu state
  const [menuVisible, setMenuVisible] = useState(false);
  const filtered = dropdownItems.filter((i) => ["trash", "move", "info"].includes(i.mode));

  const handleSelect = (mode: DropdownMode) => {
    setMenuVisible(false);
    switch (mode) {
      case "trash":
        openTrashModal();
        break;
      case "move":
        // Navigate into your MoveFile flow, passing the single photo ID
        router.push({
          pathname: ROUTES.MOVE_FILE,
          params: { selectedPhotos: JSON.stringify([photoId]) },
        });
        break;
      case "info":
        // Show whatever info you want …
        console.log({ uri, dateLabel, timeLabel });
        break;
    }
  };

  return (
    <HeaderContainer>
      <LeftSection>
        <TouchableOpacity onPress={() => router.back()}>
          <BackIcon />
        </TouchableOpacity>
      </LeftSection>

      <TitleContainer>
        <Headline2 color="#FC4646">{dateLabel}</Headline2>
        <Body5 color="#AAA">{timeLabel}</Body5>
      </TitleContainer>

      <RightSection>
        <TouchableOpacity onPress={() => setMenuVisible((v) => !v)}>
          <MenuIcon />
        </TouchableOpacity>
        {menuVisible && (
          <MenuContainer>
            {filtered.map((item: DropdownItem, idx: number) => (
              <Fragment key={idx}>
                <MenuItemButton onPress={() => handleSelect(item.mode)}>
                  <Body2>{item.label}</Body2>
                  <item.icon />
                </MenuItemButton>
                {idx < filtered.length - 1 && <Divider />}
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
}

// Styled components below (same as before)…
const LeftSection = styled.View`
  width: 30%;
  align-items: flex-start;
  justify-content: center;
`;
const TitleContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 4px;
`;
const RightSection = styled.View`
  width: 30%;
  align-items: flex-end;
  justify-content: center;
  position: relative;
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
