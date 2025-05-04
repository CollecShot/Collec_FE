import { CurrentFolderProvider } from "@/src/contexts/CurrentFolderContext";
import theme from "@/src/themes";
import { getOrCreateDeviceId } from "@/src/utils/deviceId";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { ThemeProvider } from "styled-components";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

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

  // Device ID 로드
  useEffect(() => {
    (async () => {
      const id = await getOrCreateDeviceId();
      console.log("[RootLayout] deviceId ready:", id);
      setDeviceId(id);
    })();
  }, []);

  // 폰트 + deviceId 준비되면 스플래시 숨기기
  useEffect(() => {
    if ((fontsLoaded || fontError) && deviceId) {
      SplashScreen.hideAsync().catch(console.warn);
    }
  }, [fontsLoaded, fontError, deviceId]);

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
