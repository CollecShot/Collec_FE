import Grid from "@/src/components/category/Grid";
import styled from "styled-components/native";

export default function HomeScreen() {
  return (
    <Container>
      <Grid />
    </Container>
  );
}

const Container = styled.View`
  background-color: ${({ theme }) => theme.colors.white[100]};
`;
