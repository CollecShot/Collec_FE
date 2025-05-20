import { queryClient } from "@/src/apis/queryClient";
import { CurrentFolderProvider } from "@/src/contexts/CurrentFolderContext";
import theme from "@/src/themes";
import { getOrCreateDeviceId } from "@/src/utils/deviceId";
import { QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { Alert } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Bold: require("@assets/fonts/Pretendard-Bold.otf"),
    SemiBold: require("@assets/fonts/Pretendard-SemiBold.otf"),
    Medium: require("@assets/fonts/Pretendard-Medium.otf"),
    Regular: require("@assets/fonts/Pretendard-Regular.otf"),
    Light: require("@assets/fonts/Pretendard-Light.otf"),
    ExtraLight: require("@assets/fonts/Pretendard-ExtraLight.otf"),
  });

  const [deviceId, setDeviceId] = useState<string | null>(null);
  const [deviceError, setDeviceError] = useState<Error | null>(null); // 에러 상태 추가

  useEffect(() => {
    (async () => {
      try {
        const id = await getOrCreateDeviceId();
        console.log("[RootLayout] deviceId ready:", id);
        setDeviceId(id);
      } catch (error) {
        console.error("[RootLayout] Device ID 등록 실패:", error);
        setDeviceError(error instanceof Error ? error : new Error("알 수 없는 오류"));
      }
    })();
  }, []);

  // 스플래시 숨기기
  useEffect(() => {
    if ((fontsLoaded || fontError) && deviceId) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [fontsLoaded, fontError, deviceId]);

  // Alert 띄우기
  useEffect(() => {
    if (deviceError) {
      Alert.alert("앱 시작 실패", `기기 등록 중 오류가 발생했습니다.\n\n${deviceError.message}`);
    }
  }, [deviceError]);

  if ((!fontsLoaded && !fontError) || deviceId === null) {
    return null; // 스플래시 유지
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider theme={theme}>
        <CurrentFolderProvider>
          <QueryClientProvider client={queryClient}>
            <Stack screenOptions={{ headerShown: false }} />
          </QueryClientProvider>
        </CurrentFolderProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
