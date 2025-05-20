// src/components/header/DetailHeader.tsx
import { BackIcon, MenuIcon } from "@/assets/icons/_index";
import { useMovePhotosRecycleBin } from "@/src/apis/hooks/useRecycleBin";
import { DropdownItem, dropdownItems, DropdownMode } from "@/src/constants/dropdownItems";
import { ROUTES } from "@/src/constants/routes";
import useConfirmModal from "@/src/hooks/useConfirmModal";
import { Body2, Body5, Headline2 } from "@/src/themes/typography";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { Fragment, useEffect, useState } from "react";
import { Modal, PermissionsAndroid, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import TrashConfirmModal from "../_common/modal/TrashConfirm";
import { HeaderContainer } from "../_common/styled";

export default function DetailHeader() {
  const router = useRouter();
  const { uri, photoId: rawPhotoId } = useLocalSearchParams<{ uri: string; photoId: string }>();
  const photoId = Number(rawPhotoId);
  const { mutate: moveToTrash } = useMovePhotosRecycleBin();

  // metadata state
  const [modTs, setModTs] = useState<number | null>(null);
  const [fileSize, setFileSize] = useState<number | null>(null);
  const [resolution, setResolution] = useState<{ width: number; height: number } | null>(null);

  // load metadata
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === "android") {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          if (info.modificationTime) setModTs(info.modificationTime * 1000);
          if (info.size) setFileSize(info.size);
        }
        // resolution
        Image.getSize(
          uri,
          (w, h) => setResolution({ width: w, height: h }),
          () => {},
        );
      } catch (e) {
        console.warn("getInfoAsync failed", e);
      }
    })();
  }, [uri]);

  // format date/time
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

  // trash modal
  const {
    isVisible: trashModalVisible,
    openModal: openTrashModal,
    closeModal: closeTrashModal,
    confirm: confirmTrash,
  } = useConfirmModal(() => {
    const ids = Array.isArray(photoId) ? photoId : [photoId];
    console.log("휴지통 이동 확정", ids);
    moveToTrash({ photoIds: ids });
    router.back();
  });

  // info modal state
  const [infoVisible, setInfoVisible] = useState(false);
  const openInfo = () => setInfoVisible(true);
  const closeInfo = () => setInfoVisible(false);

  // dropdown menu
  const [menuVisible, setMenuVisible] = useState(false);
  const filtered = dropdownItems.filter((i) => ["trash", "move", "info"].includes(i.mode));

  const handleSelect = (mode: DropdownMode) => {
    setMenuVisible(false);
    if (mode === "trash") openTrashModal();
    else if (mode === "move")
      router.push({
        pathname: ROUTES.MOVE_FILE,
        params: { selectedPhotos: JSON.stringify([photoId]) },
      });
    else if (mode === "info") openInfo();
  };

  // filename
  const filename = uri.split("/").pop() || "";

  return (
    <>
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

      <Modal transparent visible={infoVisible} animationType="fade">
        <Backdrop onPress={closeInfo} />
        <ModalView>
          <ModalTitle>상세 정보</ModalTitle>
          <InfoRow>
            <Label>파일 이름:</Label>
            <Value>{filename}</Value>
          </InfoRow>
          <InfoRow>
            <Label>경로:</Label>
            <Value numberOfLines={1}>{uri}</Value>
          </InfoRow>
          <InfoRow>
            <Label>크기:</Label>
            <Value>{fileSize ? `${(fileSize / 1024).toFixed(1)}KB` : "-"}</Value>
          </InfoRow>
          <InfoRow>
            <Label>해상도:</Label>
            <Value>{resolution ? `${resolution.width}×${resolution.height}` : "-"}</Value>
          </InfoRow>
          <InfoRow>
            <Label>날짜:</Label>
            <Value>{dateLabel}</Value>
          </InfoRow>
          <InfoRow>
            <Label>시간:</Label>
            <Value>{timeLabel}</Value>
          </InfoRow>
          <CloseButton onPress={closeInfo}>
            <CloseText>닫기</CloseText>
          </CloseButton>
        </ModalView>
      </Modal>
    </>
  );
}

const LeftSection = styled.View`
  width: 30%;
  align-items: flex-start;
  justify-content: center;
`;
const TitleContainer = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
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
  width: 200px;
  background-color: #fff;
  border: 0.8px solid #8e8e8e;
`;
const MenuItemButton = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px 16px;
`;
const Divider = styled.View`
  height: 0.8px;
  background-color: #8e8e8e;
`;

const Backdrop = styled.TouchableOpacity`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(42, 42, 42, 0.75);
`;
const ModalView = styled.View`
  position: absolute;
  top: 20%;
  left: 10%;
  right: 10%;
  background-color: #fff;
  padding: 16px;
  border-radius: 8px;
`;
const ModalTitle = styled(Headline2)`
  font-size: 18px;
  margin-bottom: 12px;
`;
const InfoRow = styled.View`
  flex-direction: row;
  justify-content: space-between;
  margin-bottom: 8px;
`;
const Label = styled(Body2)`
  font-weight: bold;
`;
const Value = styled(Body5)`
  flex-shrink: 1;
  text-align: right;
`;
const CloseButton = styled.TouchableOpacity`
  margin-top: 16px;
  align-self: flex-end;
`;
const CloseText = styled(Body2)`
  font-weight: bold;
  color: ${({ theme }) => theme.colors.red[100]};
`;
