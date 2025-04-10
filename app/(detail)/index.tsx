import { useNavigation } from "@react-navigation/native";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { TouchableWithoutFeedback } from "react-native";
import styled from "styled-components/native";

export default function DetailScreen() {
  const { uri } = useLocalSearchParams<{ uri: string }>();
  console.log(uri);
  const router = useRouter();
  const navigation = useNavigation();
  const [headerVisible, setHeaderVisible] = useState(true);

  // headerVisible 상태에 따라 header 표시 여부를 업데이트
  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: headerVisible,
    });
  }, [headerVisible, navigation]);

  // 화면 터치 시 header 표시 토글
  const toggleHeader = () => {
    setHeaderVisible((prev) => !prev);
  };

  return (
    <TouchableWithoutFeedback onPress={toggleHeader}>
      <Container>
        <StyledImage source={{ uri }} resizeMode="contain" />
      </Container>
    </TouchableWithoutFeedback>
  );
}

const Container = styled.View`
  flex: 1;
  background-color: #fff;
`;

const StyledImage = styled.Image`
  flex: 1;
`;
