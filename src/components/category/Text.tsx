import { Body5, Headline3 } from "@/src/themes/typography";
import styled from "styled-components/native";

type CategoryTextProps = {
  title: string;
  count?: number;
};

const CategoryText: React.FC<CategoryTextProps> = ({ title, count }) => {
  return (
    <Container>
      <Headline3 styles="margin-top: 5px">{title}</Headline3>
      {count !== undefined && <Body5 color="#8e8e8e">{count}</Body5>}
    </Container>
  );
};

export default CategoryText;

const Container = styled.View`
  flex-direction: column;
  align-items: flex-start;
`;
