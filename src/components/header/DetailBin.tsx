import { BackIcon, MenuIcon } from "@/assets/icons/_index";
import { useDeletePhotos, useRestorePhotos } from "@/src/apis/hooks/useRecycleBin";
import DeleteConfirmModal, { RedText } from "@/src/components/_common/modal/DeleteConfirm";
import RestoreConfirmModal from "@/src/components/_common/modal/RestoreConfirm";
import { HeaderContainer } from "@/src/components/_common/styled";
import SelectMenu from "@/src/components/bin/SelectMenu";
import { DropdownMode } from "@/src/constants/dropdownItems";
import { Body5, Headline2 } from "@/src/themes/typography";
import * as FileSystem from "expo-file-system";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { PermissionsAndroid, Platform, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

export default function DetailBinHeader() {
  const router = useRouter();
  const { uri, photoId: rawId } = useLocalSearchParams<{ uri: string; photoId: string }>();
  const photoId = Number(rawId);

  // metadata state
  const [modTs, setModTs] = useState<number | null>(null);

  // load metadata
  useEffect(() => {
    (async () => {
      try {
        if (Platform.OS === "android") {
          await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE);
        }
        const info = await FileSystem.getInfoAsync(uri);
        if (info.exists) {
          info.modificationTime && setModTs(info.modificationTime * 1000);
        }
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

  // menu & modal state
  const [menuVisible, setMenuVisible] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showRestoreModal, setShowRestoreModal] = useState(false);

  const { mutate: deleteMutate } = useDeletePhotos();
  const { mutate: restoreMutate } = useRestorePhotos();

  const handleSelectMode = (mode: DropdownMode) => {
    setMenuVisible(false);
    if (mode === "delete") setShowDeleteModal(true);
    else if (mode === "restore") setShowRestoreModal(true);
  };

  const confirmDelete = () => {
    deleteMutate([photoId]);
    closeAll();
    router.back();
  };

  const confirmRestore = () => {
    restoreMutate([photoId]);
    closeAll();
    router.back();
  };

  const closeAll = () => {
    setMenuVisible(false);
    setShowDeleteModal(false);
    setShowRestoreModal(false);
  };

  return (
    <>
      <HeaderContainer>
        <LeftSection>
          <TouchableOpacity onPress={() => router.back()}>
            <BackIcon />
          </TouchableOpacity>
        </LeftSection>

        <TitleSection>
          <Headline2 color="#FC4646">{dateLabel}</Headline2>
          <Body5 color="#AAA">{timeLabel}</Body5>
        </TitleSection>

        <RightSection>
          <TouchableOpacity onPress={() => setMenuVisible((v) => !v)}>
            <MenuIcon />
          </TouchableOpacity>
          {menuVisible && <SelectMenu onSelectMode={handleSelectMode} width="180%" />}
        </RightSection>
      </HeaderContainer>

      <DeleteConfirmModal
        visible={showDeleteModal}
        count={1}
        showStar
        onCancel={closeAll}
        onConfirm={confirmDelete}
        title={
          <>
            사진을 <RedText>삭제</RedText>할까요?
          </>
        }
      />

      <RestoreConfirmModal
        visible={showRestoreModal}
        count={1}
        showStar
        onCancel={closeAll}
        onConfirm={confirmRestore}
        title={
          <>
            사진을 다시 <RedText>복구</RedText>할까요?
          </>
        }
      />
    </>
  );
}

const LeftSection = styled.View`
  width: 30%;
  align-items: flex-start;
  justify-content: center;
`;

const TitleSection = styled.View`
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
