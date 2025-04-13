// app/test‑screenshots.tsx
import usePollingScreenshots from "@/src/hooks/usePollingScreenshots";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, FlatList } from "react-native";
import styled from "styled-components/native";

export default function TestScreenshots() {
  // 1) deviceRegisterTs 로드
  const [deviceTs, setDeviceTs] = useState<number | null>(null);
  useEffect(() => {
    (async () => {
      const ts = await AsyncStorage.getItem("deviceRegisterTs");
      if (ts) {
        setDeviceTs(Number(ts));
      } else {
        const now = Math.floor(Date.now() / 1000);
        await AsyncStorage.setItem("deviceRegisterTs", now.toString());
        setDeviceTs(now);
      }
    })();
  }, []);

  // 2) 훅 호출 (deviceTs가 세팅되기 전에는 빈 배열 반환)
  const screenshots = usePollingScreenshots(deviceTs ?? 0);

  // 3) 로딩 상태
  if (deviceTs === null) {
    return (
      <LoadingContainer>
        <ActivityIndicator size="large" />
      </LoadingContainer>
    );
  }

  return (
    <Container>
      <Title>테스트용 스크린샷 확인</Title>

      {screenshots.length === 0 ? (
        <Message>등록 시점 이후 찍힌 스크린샷이 없습니다.</Message>
      ) : (
        <List
          data={screenshots}
          keyExtractor={(item) => item.id}
          numColumns={3}
          renderItem={({ item }) => <Thumb source={{ uri: item.uri }} />}
          contentContainerStyle={{ paddingBottom: 16 }}
        />
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  padding: 16px;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const LoadingContainer = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const Title = styled.Text`
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 12px;
`;

const Message = styled.Text`
  font-size: 16px;
  color: gray;
`;

const List = styled(FlatList as new () => FlatList<{ id: string; uri: string }>)``;

const Thumb = styled.Image`
  width: 100px;
  height: 100px;
  margin: 4px;
  border-radius: 8px;
`;
