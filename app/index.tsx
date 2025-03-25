import { ROUTES } from "@/src/constants/routes";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    async function checkFirstLaunch() {
      const isFirstLogin = await isUserFirstLogin();

      if (isFirstLogin) {
        // 온보딩(랜딩) 페이지로 이동
        //router.replace("(onboarding)/step1");
      } else {
        // 이미 온보딩을 마친 사용자 → 메인으로
        router.replace(ROUTES.MAIN_HOME);
      }
    }
    checkFirstLaunch();
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <ActivityIndicator size="large" />
    </View>
  );
}

// TODO: AsyncStorage or API 사용용
async function isUserFirstLogin() {
  // TODO: 실제 로직
  return false;
}
