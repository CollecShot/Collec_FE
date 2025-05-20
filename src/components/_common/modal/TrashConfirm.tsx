import { Body2, Body6, Headline3 } from "@/src/themes/typography";
import React from "react";
import { Modal } from "react-native";
import styled from "styled-components/native";

interface TrashConfirmModalProps {
  visible: boolean; // 모달 표시 여부
  count: number; // 선택된 사진 개수
  showStar?: boolean; // * 표시 여부
  onCancel: () => void; // "아니오" 버튼 클릭 시
  onConfirm: () => void; // "휴지통으로 이동" 버튼 클릭 시
}

const TrashConfirmModal: React.FC<TrashConfirmModalProps> = ({
  visible,
  count,
  showStar = false,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Overlay onPress={onCancel} activeOpacity={1}>
        {/* 
          Container를 TouchableOpacity 대신 View로 감싸고
          Overlay 터치 이벤트가 Container에 전달되지 않도록 하기 위해 
          onPress={()}로 이벤트 중단 처리를 해도 됨
        */}
        <Container activeOpacity={1} onPress={() => {}}>
          <Title>
            <Headline3>
              {count}장의 사진을 <RedText>휴지통</RedText>
              으로 이동할까요?
            </Headline3>
            <Body6 color="#8E8E8E">휴지통으로 이동된 사진은 30일 동안 확인이 가능해요</Body6>
          </Title>
          <ButtonRow>
            <ButtonLeft onPress={onCancel}>
              <Body2>아니오</Body2>
            </ButtonLeft>
            <ButtonRight onPress={onConfirm}>
              <Body2 color="#fff">휴지통으로 이동</Body2>
            </ButtonRight>
          </ButtonRow>
        </Container>
      </Overlay>
    </Modal>
  );
};

export default TrashConfirmModal;

const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: #2a2a2abf;
  justify-content: center;
  align-items: center;
`;

const Container = styled.TouchableOpacity`
  width: 90%;
  border: 0.8px solid #8e8e8e;
  background-color: #fff;
`;

const Title = styled.View`
  align-items: center;
  justify-content: center;
  margin: 40px 0;
  gap: 4px;
`;

const RedText = styled(Headline3)`
  color: #ff2d55;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  border-top-width: 0.8px;
  border-top-color: #8e8e8e;
`;

const ButtonLeft = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  border-right-width: 0.8px;
  border-right-color: #8e8e8e;
  background-color: #d4d4d4;
`;

const ButtonRight = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  background-color: #fc4646;
`;
