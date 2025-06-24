import { ROUTES } from "@/src/constants/routes";
import { logEvent } from "@/src/utils/analytics";
import { Image } from "expo-image";
import * as MediaLibrary from "expo-media-library";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { ActivityIndicator, Alert, ImageBackground, Linking, TouchableOpacity } from "react-native";
import styled from "styled-components/native";

SplashScreen.preventAutoHideAsync();

export default function Index() {
  const router = useRouter();
  const [showGif, setShowGif] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);

  useEffect(() => {
    async function prepare() {
      await SplashScreen.hideAsync();
      setShowGif(true);

      setTimeout(async () => {
        setShowGif(false);
        const { status } = await MediaLibrary.getPermissionsAsync();
        if (status === "granted") {
          router.replace(ROUTES.MAIN_HOME);
        } else {
          setShowAuthPrompt(true);
        }
      }, 14000);
    }
    prepare();
  }, []);

  // 사진 접근 권한 요청 함수
  const handleAuthImagePress = async () => {
    const { status } = await MediaLibrary.requestPermissionsAsync();
    if (status === "granted") {
      try {
        await logEvent("sign_up", {
          method: "device_uid",
        });
      } catch (e) {
        console.warn("logEvent error:", e); // 에러 로그 출력
      }

      router.replace(ROUTES.MAIN_HOME);
    } else {
      Alert.alert(
        "권한이 필요합니다",
        "앱에서 사진에 접근하려면 권한이 필요해요. 설정으로 이동하시겠어요?",
        [
          { text: "취소", style: "cancel" },
          { text: "설정으로 이동", onPress: () => Linking.openSettings() },
        ],
      );
    }
  };

  // 로딩 표시 -> 추후 UI 필요
  if (!showGif && !showAuthPrompt) {
    return <Loader size="large" />;
  }

  return (
    <Container>
      {showGif && (
        <GifImage source={require("@assets/animations/onboarding.webp")} contentFit="cover" />
      )}

      {showAuthPrompt && (
        <BackgroundContainer
          source={require("@assets/images/auth/background.webp")}
          resizeMode="cover"
        >
          <TouchableOpacity onPress={handleAuthImagePress}>
            <AuthImage source={require("@assets/images/auth/auth.webp")} contentFit="contain" />
          </TouchableOpacity>
        </BackgroundContainer>
      )}
    </Container>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: ${({ theme }) => theme.colors.white[100]};
`;

const Loader = styled(ActivityIndicator).attrs({ color: "#888" })`
  flex: 1;
`;

const GifImage = styled(Image)`
  width: 100%;
  height: 100%;
`;

const BackgroundContainer = styled(ImageBackground)`
  flex: 1;
  justify-content: flex-start;
  align-items: center;
  width: 100%;
`;

const AuthImage = styled(Image)`
  width: 95%;
  aspect-ratio: 0.5;
  z-index: 1;
`;
