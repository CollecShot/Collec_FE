import { Body2, Headline3 } from "@/src/themes/typography";
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
            <Headline3>
              {photoCount}장의 사진을{`\n`} <RedText>[{fromFolder}]</RedText>에서{" "}
              <RedText>[{toFolder}]</RedText>로{`\n`} 이동할까요?
            </Headline3>
          </Title>
          <ButtonRow>
            <ButtonLeft onPress={onCancel}>
              <Body2>아니오</Body2>
            </ButtonLeft>
            <ButtonRight onPress={onConfirm}>
              <Body2 color="#fff">다른 파일로 이동</Body2>
            </ButtonRight>
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
  width: 90%;
  border: 0.8px solid #8e8e8e;
  background-color: #fff;
`;

const Title = styled.Text`
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  text-align: center;
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
