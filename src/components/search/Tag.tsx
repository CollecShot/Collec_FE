import { CloseIcon } from "@/assets/icons/_index";
import { Body3 } from "@/src/themes/typography";
import styled from "styled-components/native";

interface TagProps {
  label: string;
  onRemove?: () => void;
}

const Tag: React.FC<TagProps> = ({ label, onRemove }) => {
  return (
    <TagWrapper>
      <Body3>{label}</Body3>
      <CloseButton onPress={onRemove}>
        <CloseIcon width={19} height={19} fill="#2b2b2b" />
      </CloseButton>
    </TagWrapper>
  );
};

export default Tag;

const TagWrapper = styled.View`
  position: relative;
  border: 1px solid #2b2b2b;
  border-radius: 20px;
  padding: 8px 14px;
  margin-right: 4px;
  margin-bottom: 8px;
`;

const CloseButton = styled.TouchableOpacity`
  position: absolute;
  top: -9px;
  right: -3px;
  border-radius: 100%;
  background-color: #fff;
  justify-content: center;
  align-items: center;
`;
