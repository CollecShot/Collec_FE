import { Body1 } from "@/src/themes/typography";
import { TouchableOpacity } from "react-native";
import styled from "styled-components/native";
import Tag from "./Tag";

interface RecentSearchProps {
  searches: string[];
  onRemoveItem: (item: string) => void;
  onSelectItem: (item: string) => void;
}

const RecentSearch: React.FC<RecentSearchProps> = ({ searches, onRemoveItem, onSelectItem }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <Container>
      <Title>최근 검색어</Title>
      <TagList>
        {searches.map((item) => (
          <TagWrapper key={item}>
            <TouchableOpacity onPress={() => onSelectItem(item)}>
              <Tag label={item} onRemove={() => onRemoveItem(item)} />
            </TouchableOpacity>
          </TagWrapper>
        ))}
      </TagList>
    </Container>
  );
};

export default RecentSearch;

const Container = styled.View`
  margin-top: 40px;
`;

const Title = styled(Body1)`
  font-weight: bold;
  font-size: 16px;
  margin-bottom: 8px;
  color: #2b2b2b;
`;

const TagList = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
`;

const TagWrapper = styled.View`
  margin-right: 8px;
  margin-bottom: 8px;
`;
