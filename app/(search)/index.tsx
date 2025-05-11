import { useSearchPhotos } from "@/src/apis/hooks/useSearchPhotos";
import NoSearchResults from "@/src/components/search/NoSearchResults";
import RecentSearch from "@/src/components/search/RecentSearch";
import SearchBar from "@/src/components/search/SearchBar";
import { ROUTES } from "@/src/constants/routes";
import { Body6 } from "@/src/themes/typography";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { FlatList, Text, TouchableOpacity, View } from "react-native";
import styled from "styled-components/native";

export default function SearchScreen() {
  const router = useRouter();
  const { keyword: initialKeyword = "" } = useLocalSearchParams<{ keyword?: string }>();
  const [query, setQuery] = useState(initialKeyword);
  const [hasSearched, setHasSearched] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    AsyncStorage.getItem("recentSearches")
      .then((str) => {
        if (str) {
          setRecentSearches(JSON.parse(str));
        }
      })
      .catch((err) => console.warn("Failed to load recent searches", err));
  }, []);

  useEffect(() => {
    if (query === "") {
      setHasSearched(false);
    }
  }, [query]);

  const { data: photos = [], isLoading, isError } = useSearchPhotos(query, hasSearched);

  const onSubmit = () => {
    if (!query) return;
    setHasSearched(true);
    setRecentSearches((prev) => {
      const updated = prev.includes(query) ? prev : [query, ...prev];
      AsyncStorage.setItem("recentSearches", JSON.stringify(updated)).catch((err) =>
        console.warn("Failed to save recent searches", err),
      );
      return updated;
    });
  };

  const onClear = () => {
    setQuery("");
    setHasSearched(false);
  };

  const onRemoveRecent = (item: string) => {
    const updated = recentSearches.filter((x) => x !== item);
    setRecentSearches(updated);
    AsyncStorage.setItem("recentSearches", JSON.stringify(updated)).catch((err) =>
      console.warn("Failed to remove recent search", err),
    );
  };

  const onSelectRecent = (item: string) => {
    setQuery(item);
    setHasSearched(true);
    onSubmit();
  };

  const onPressPhoto = (uri: string) => router.push({ pathname: ROUTES.DETAIL, params: { uri } });

  // Before first search: show recent searches
  if (!hasSearched) {
    return (
      <Container>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSubmit}
          onClear={onClear}
        />
        <RecentSearch
          searches={recentSearches}
          onRemoveItem={onRemoveRecent}
          onSelectItem={onSelectRecent}
        />
      </Container>
    );
  }

  // Loading or error
  if (isLoading || isError) {
    return (
      <Container>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSubmit}
          onClear={onClear}
        />
        <Centered>{isLoading ? <></> : <Text>검색 중 오류가 발생했습니다.</Text>}</Centered>
      </Container>
    );
  }

  // No results
  if (photos.length === 0) {
    return (
      <Container>
        <SearchBar
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={onSubmit}
          onClear={onClear}
        />
        <NoSearchResults query={query} />
      </Container>
    );
  }

  // Results exist: show Text and Photo sections
  const display = photos.slice(0, 15);

  return (
    <Container>
      <SearchBar
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={onSubmit}
        onClear={onClear}
      />
      <View style={{ marginTop: 60 }}>
        {/* Text Results Section */}
        <SectionHeader>
          <TitleRow>
            <Highlight>'{query}'</Highlight>
            <Label> _ Text로 찾기</Label>
          </TitleRow>
          <MoreButton
            onPress={() => router.push({ pathname: ROUTES.SEARCH_TEXT, params: { query } })}
          >
            <MoreText>더보기</MoreText>
          </MoreButton>
        </SectionHeader>
        <FlatList
          data={display}
          numColumns={5}
          keyExtractor={(item) => item.photoId.toString()}
          renderItem={({ item }) => (
            <PhotoWrapper onPress={() => onPressPhoto(item.photoFilepath)}>
              <ItemImage source={{ uri: item.photoFilepath }} />
            </PhotoWrapper>
          )}
        />

        {/* Photo Results Section */}
        <SectionHeader>
          <TitleRow>
            <Highlight>'{query}'</Highlight>
            <Label> _ Photo로 찾기</Label>
          </TitleRow>
          <MoreButton
            onPress={() => router.push({ pathname: ROUTES.SEARCH_PHOTO, params: { query } })}
          >
            <MoreText>더보기</MoreText>
          </MoreButton>
        </SectionHeader>
        <FlatList
          data={display}
          numColumns={5}
          keyExtractor={(item) => item.photoId.toString()}
          renderItem={({ item }) => (
            <PhotoWrapper onPress={() => onPressPhoto(item.photoFilepath)}>
              <ItemImage source={{ uri: item.photoFilepath }} />
            </PhotoWrapper>
          )}
        />
      </View>
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const Centered = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const SectionHeader = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-top: 24px;
  margin-bottom: 8px;
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

const MoreButton = styled(TouchableOpacity)`
  padding: 4px 8px;
`;

const MoreText = styled(Body6)`
  font-size: 13px;
  font-weight: bold;
  color: ${({ theme }) => theme.colors.black[300]};
`;

const PhotoWrapper = styled.TouchableOpacity`
  width: 20%;
  aspect-ratio: 1;
  padding: 2px;
`;

const ItemImage = styled.Image`
  width: 100%;
  height: 100%;
`;
