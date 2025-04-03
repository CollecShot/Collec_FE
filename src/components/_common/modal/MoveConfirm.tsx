import React from "react";
import { Modal } from "react-native";
import styled from "styled-components/native";

interface MoveConfirmModalProps {
  visible: boolean;
  fromFolder: string;
  toFolder: string;
  photoCount: number;
  onCancel: () => void;
  onConfirm: () => void;
}

const MoveConfirmModal: React.FC<MoveConfirmModalProps> = ({
  visible,
  fromFolder,
  toFolder,
  photoCount,
  onCancel,
  onConfirm,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onCancel}>
      <Overlay activeOpacity={1} onPress={onCancel}>
        <Container activeOpacity={1} onPress={() => {}}>
          <Title>
            {photoCount}장의 사진을{`\n`} <Highlight>[{fromFolder}]</Highlight>에서{" "}
            <Highlight>[{toFolder}]</Highlight>로{`\n`} 이동할까요?
          </Title>
          <ButtonRow>
            <CancelButton onPress={onCancel}>
              <ButtonText>아니오</ButtonText>
            </CancelButton>
            <ConfirmButton onPress={onConfirm}>
              <ButtonText style={{ color: "red" }}>다른 파일로 이동</ButtonText>
            </ConfirmButton>
          </ButtonRow>
        </Container>
      </Overlay>
    </Modal>
  );
};

export default MoveConfirmModal;

const Overlay = styled.TouchableOpacity`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.5);
  justify-content: center;
  align-items: center;
`;

const Container = styled.TouchableOpacity`
  width: 80%;
  background-color: #eee;
`;

const Title = styled.Text`
  font-size: 16px;
  color: #000;
  margin: 20px;
  line-height: 22px;
  text-align: center;
`;

const Highlight = styled.Text`
  color: red;
  font-weight: bold;
`;

const ButtonRow = styled.View`
  flex-direction: row;
  border-top-width: 1px;
  border-top-color: #ccc;
`;

const CancelButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
  border-right-width: 1px;
  border-right-color: #ccc;
`;

const ConfirmButton = styled.TouchableOpacity`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 15px 0;
`;

const ButtonText = styled.Text`
  font-size: 16px;
  color: #000;
`;
