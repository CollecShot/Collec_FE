import styled from "styled-components/native";
import CategoryText from "./Text";

type ItemProps = {
  title: string;
  imageUri: string;
  count: number;
  onPress?: () => void;
};

const Item: React.FC<ItemProps> = ({ title, imageUri, count, onPress }) => {
  return (
    <ItemContainer>
      <ImageWrapper activeOpacity={0.8} onPress={onPress}>
        <CategoryImage source={{ uri: imageUri }} />
      </ImageWrapper>
      <CategoryText title={title} count={count} />
    </ItemContainer>
  );
};

export default Item;

const ItemContainer = styled.View`
  width: 30%;
  margin: 1.5%;
`;

const ImageWrapper = styled.TouchableOpacity`
  width: 100%;
  justify-content: center;
  align-items: center;
  border: 0.5px solid #7b7b7b;
  aspect-ratio: 1;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const CategoryImage = styled.Image`
  width: 100%;
  height: 100%;
`;
