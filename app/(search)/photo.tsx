import { Body6 } from "@/src/themes/typography";
import { useLocalSearchParams, useRouter } from "expo-router";
import React from "react";
import { ActivityIndicator, FlatList, Text } from "react-native";
import { PinchGestureHandler } from "react-native-gesture-handler";
import styled from "styled-components/native";

import { useSearchPhotos } from "@/src/apis/hooks/useSearchPhotos";
import type { SearchPhoto } from "@/src/apis/search";
import NoSearchResults from "@/src/components/search/NoSearchResults";
import { ROUTES } from "@/src/constants/routes";
import usePinchToZoom from "@/src/hooks/usePinchToZoom";

export default function PhotoResultsScreen() {
  const router = useRouter();
  const { query } = useLocalSearchParams<{ query: string }>();
  const { data: photos = [], isLoading, isError } = useSearchPhotos(query, true);
  const { numColumns, handlePinch } = usePinchToZoom();

  const handlePress = (uri: string) => {
    router.push({ pathname: ROUTES.DETAIL, params: { uri } });
  };

  return (
    <Container>
      <TitleRow>
        <Highlight>'{query}'</Highlight>
        <Label> _ Photo로 찾기</Label>
      </TitleRow>
      {isLoading ? (
        <Centered>
          <ActivityIndicator size="large" />
        </Centered>
      ) : isError ? (
        <Centered>
          <Text>검색 중 오류가 발생했습니다.</Text>
        </Centered>
      ) : photos.length === 0 ? (
        <NoSearchResults query={query} type="photo" />
      ) : (
        <PinchGestureHandler onHandlerStateChange={handlePinch}>
          <GridContainer>
            <FlatList
              key={`grid-${numColumns}`}
              data={photos}
              numColumns={numColumns}
              keyExtractor={(item: SearchPhoto) => item.photoId.toString()}
              renderItem={({ item }) => (
                <PhotoWrapper
                  numColumns={numColumns}
                  onPress={() => handlePress(item.photoFilepath)}
                >
                  <ItemImage source={{ uri: item.photoFilepath }} />
                </PhotoWrapper>
              )}
            />
          </GridContainer>
        </PinchGestureHandler>
      )}
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

const TitleRow = styled.View`
  flex-direction: row;
  align-items: center;
  gap: 6px;
  padding-top: 4px;
  margin-bottom: 6px;
`;

const Highlight = styled(Body6)`
  font-size: 15px;
  color: ${({ theme }) => theme.colors.red[100]};
`;

const Label = styled(Body6)`
  font-size: 15px;
  color: #585858;
`;

const GridContainer = styled.View`
  flex: 1;
`;

const PhotoWrapper = styled.TouchableOpacity<{ numColumns: number }>`
  width: ${({ numColumns }) => `${100 / numColumns}%`};
  aspect-ratio: 1;
  padding: 3px;
`;

const ItemImage = styled.Image`
  width: 100%;
  height: 100%;
`;
