import NoSearchResults from "@/src/components/search/NoSearchResults";
import RecentSearch from "@/src/components/search/RecentSearch";
import SearchBar from "@/src/components/search/SearchBar";
import { useState } from "react";
import styled from "styled-components/native";

const SearchScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  const handleSearchSubmit = () => {
    console.log("검색어:", query);
    if (query && !recentSearches.includes(query)) {
      setRecentSearches([query, ...recentSearches]);
    }
    setHasSearched(true);
    // 실제 검색 로직 구현 가능 (예: 라우터 이동, API 호출 등)
  };

  const handleClearSearch = () => {
    setHasSearched(false);
    setQuery("");
  };

  const handleRemoveRecent = (item: string) => {
    setRecentSearches((prev) => prev.filter((x) => x !== item));
  };

  return (
    <Container>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearchSubmit}
        onClear={handleClearSearch}
      />
      {!hasSearched && <RecentSearch searches={recentSearches} onRemoveItem={handleRemoveRecent} />}
      {/* 검색 후( hasSearched === true )에 결과가 없다고 가정해 NoSearchResults 표시 */}
      {hasSearched && <NoSearchResults query={query} />}
    </Container>
  );
};

export default SearchScreen;

const Container = styled.View`
  flex: 1;
  background-color: ${({ theme }) => theme.colors.white[100]};
  padding: 16px;
`;
