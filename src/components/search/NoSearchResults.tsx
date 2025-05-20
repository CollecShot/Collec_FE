import { Body6 } from "@/src/themes/typography";
import styled from "styled-components/native";

export type NoSearchResultsType = "text" | "photo" | "both";

interface NoSearchResultsProps {
  query: string;
  type?: NoSearchResultsType; // default to "both"
}

const NoSearchResults: React.FC<NoSearchResultsProps> = ({ query, type = "both" }) => (
  <Container>
    {(type === "text" || type === "both") && (
      <>
        <TitleRow>
          <Highlight>'{query}'</Highlight>
          <Label> _ Text로 찾기</Label>
        </TitleRow>
        <NoResultBox>
          <NoResultText>검색결과가 없어요</NoResultText>
        </NoResultBox>
      </>
    )}

    {(type === "photo" || type === "both") && (
      <>
        <TitleRow>
          <Highlight>'{query}'</Highlight>
          <Label> _ Photo로 찾기</Label>
        </TitleRow>
        <NoResultBox>
          <NoResultText>검색결과가 없어요</NoResultText>
        </NoResultBox>
      </>
    )}
  </Container>
);

export default NoSearchResults;

const Container = styled.View`
  margin-top: 60px;
`;

const TitleRow = styled.View`
  flex-direction: row;
  padding-top: 4px;
  margin-bottom: 6px;
  gap: 6px;
`;

const Highlight = styled(Body6)`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.red[100]};
`;

const Label = styled(Body6)`
  font-size: 13px;
  color: #585858;
`;

const NoResultBox = styled.View`
  border: 0.8px solid ${({ theme }) => theme.colors.red[100]};
  margin-bottom: 33px;
  justify-content: center;
  align-items: center;
`;

const NoResultText = styled.Text`
  padding: 90px 0;
  color: #8e8e8e;
`;
