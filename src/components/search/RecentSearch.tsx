import { Body1 } from "@/src/themes/typography";
import styled from "styled-components/native";
import Tag from "./Tag";

interface RecentSearchProps {
  searches: string[];
  onRemoveItem: (item: string) => void;
}

const RecentSearch: React.FC<RecentSearchProps> = ({ searches, onRemoveItem }) => {
  if (!searches || searches.length === 0) return null;

  return (
    <Container>
      <Body1 styles={{ marginBottom: 15 }}>최근 검색어</Body1>
      <TagList>
        {searches.map((item) => (
          <Tag key={item} label={item} onRemove={() => onRemoveItem(item)} />
        ))}
      </TagList>
    </Container>
  );
};

export default RecentSearch;

const Container = styled.View`
  margin-top: 40px;
`;

const Title = styled.Text`
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
  flex-direction: row;
  align-items: center;
  border: 1px solid #aaa;
  border-radius: 20px;
  padding: 6px 10px;
  margin-right: 8px;
  margin-bottom: 8px;
`;

const TagText = styled.Text`
  font-size: 14px;
  color: #2b2b2b;
  margin-right: 6px;
`;

const CloseIconContainer = styled.TouchableOpacity`
  justify-content: center;
  align-items: center;
`;
