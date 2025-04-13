import { ROUTES } from "@/src/constants/routes";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator } from "react-native";
import styled from "styled-components/native";

// 스플래시 화면이 자동으로 사라지지 않도록 설정
SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  // 로딩 단계에서 GIF 애니메이션을 표시할지 여부
  const [showGif, setShowGif] = useState(false);
  // 이미 라우팅을 완료했는지 여부 (중복 이동 방지용)
  const [hasNavigated, setHasNavigated] = useState(false);

  useEffect(() => {
    async function checkFirstLaunch() {
      // TODO: 실제 로직에 따라 첫 로그인 여부 확인
      const isFirstLogin = await isUserFirstLogin();

      // 리소스가 로딩되면 스플래시 화면 숨김
      await SplashScreen.hideAsync();

      // 만약 온보딩 로직이 필요하다면 여기에 추가
      // 예: if (isFirstLogin) { router.replace("(onboarding)/step1"); return; }

      // 현재는 메인 화면으로 바로 넘어가기 위해 GIF를 보여줍니다.
      setShowGif(true);

      // GIF의 전체 재생 시간에 맞춰 타이머 설정 (예: 4000ms)
      setTimeout(() => {
        if (!hasNavigated) {
          setHasNavigated(true);
          router.replace(ROUTES.MAIN_HOME);
        }
      }, 16000);
    }
    checkFirstLaunch();
  }, []);

  return (
    <Container>
      {!showGif ? (
        <ActivityIndicator size="large" />
      ) : (
        <GifImage source={require("@assets/animations/onboarding.gif")} contentFit="cover" />
      )}
    </Container>
  );
}

// TODO: 실제 로직에 맞게 수정
async function isUserFirstLogin() {
  // 실제 AsyncStorage나 API 호출을 통해 결정
  return false;
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const GifImage = styled(Image)`
  width: 100%;
  height: 100%;
`;
