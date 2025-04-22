import { ROUTES } from "@/src/constants/routes";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import FastImage from "react-native-fast-image";
import styled from "styled-components/native";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      // 네이티브 스플래시 숨기기
      await SplashScreen.hideAsync();
      setIsReady(true);

      // 14초 후 메인 화면으로 이동
      setTimeout(() => {
        router.replace(ROUTES.MAIN_HOME);
      }, 14000);
    }
    prepare();
  }, []);

  if (!isReady) {
    return <ActivityIndicator size="large" />;
  }

  return (
    <Container>
      <GifImage
        source={require("@assets/animations/onboarding.webp")}
        resizeMode={FastImage.resizeMode.cover}
      />
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const GifImage = styled(FastImage)`
  width: 100%;
  height: 100%;
`;
