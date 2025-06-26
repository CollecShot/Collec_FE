import { CATEGORY_TITLES } from "@/src/constants/categories";
import styled from "styled-components/native";
import Item from "./Item";

type CategoryData = {
  id: string;
  key: keyof typeof CATEGORY_TITLES;
  title: string;
  imageUri: string | null;
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
          iconKey={category.key.toString()}
          title={category.title}
          imageUri={category.imageUri}
          count={category.count}
          // count가 0이면 이동 불가
          onPress={category.count > 0 ? () => onPressItem?.(category) : undefined}
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
