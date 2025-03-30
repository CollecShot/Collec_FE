import styled from "styled-components/native";
import Item from "./Item";

type CategoryData = {
  id: string;
  title: string;
  imageUri: string;
  count: number;
};

interface GridProps {
  data: CategoryData[];
  onPressItem?: (category: CategoryData) => void;
}

const Grid: React.FC<GridProps> = ({ data, onPressItem }) => {
  return (
    <Container>
      {data.map((category) => (
        <Item
          key={category.id}
          title={category.title}
          imageUri={category.imageUri}
          count={category.count}
          onPress={() => onPressItem?.(category)}
        />
      ))}
    </Container>
  );
};

export default Grid;

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 15px;
`;
