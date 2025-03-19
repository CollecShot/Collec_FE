import theme from "@/src/themes";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { ThemeProvider } from "styled-components";

SplashScreen.preventAutoHideAsync(); // 스플래시 화면이 자동으로 사라지지 않도록 설정

export default function RootLayout() {
  const [fontsLoaded, error] = useFonts({
    Bold: require("@assets/fonts/Pretendard-Bold.otf"),
    SemiBold: require("@assets/fonts/Pretendard-SemiBold.otf"),
    Medium: require("@assets/fonts/Pretendard-Medium.otf"),
    Regular: require("@assets/fonts/Pretendard-Regular.otf"),
    Light: require("@assets/fonts/Pretendard-Light.otf"),
    ExtraLight: require("@assets/fonts/Pretendard-ExtraLight.otf"),
  });

  useEffect(() => {
    if (fontsLoaded || error) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, error]);

  if (!fontsLoaded && !error) {
    return null; //TODO 여기 스플래쉬 화면 추가
  }
  return (
    <ThemeProvider theme={theme}>
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      />
    </ThemeProvider>
  );
}
