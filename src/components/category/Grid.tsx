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
  disabledIds?: string[];
  mode?: "home" | "move";
}

const Grid: React.FC<GridProps> = ({ data, onPressItem, disabledIds, mode }) => {
  return (
    <Container>
      {data.map((category) => (
        <Item
          key={category.id}
          iconKey={category.key.toString()}
          title={category.title}
          imageUri={category.imageUri}
          count={category.count}
          disabled={
            mode === "home" ? category.count === 0 || disabledIds?.includes(category.id) : false
          }
          onPress={
            mode === "home"
              ? category.count > 0 && !disabledIds?.includes(category.id)
                ? () => onPressItem?.(category)
                : undefined
              : () => onPressItem?.(category)
          } // count가 0이면 이동 불가
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
