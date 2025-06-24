import AsyncStorage from "@react-native-async-storage/async-storage";
import "react-native-get-random-values";
import { v4 as uuidv4 } from "uuid";

const MEASUREMENT_ID = process.env.MEASUREMENT_ID;
const API_SECRET = process.env.GA_API_SECRET;

// client_id (UUID) 관리: 앱 설치 시 생성 후 유지
const getClientId = async (): Promise<string> => {
  let id = await AsyncStorage.getItem("ga4_client_id");
  if (!id) {
    id = uuidv4();
    await AsyncStorage.setItem("ga4_client_id", id);
  }
  return id;
};

// (선택) user_id 설정: 기기 UID 등
const getUserId = async (): Promise<string | undefined> => {
  // 예: Constants.deviceId 또는 AsyncStorage의 사용자 ID
  return undefined; // 필요 시 구현
};

// GA4에 이벤트 전송
export const logEvent = async (eventName: string, params: Record<string, any> = {}) => {
  const clientId = await getClientId();
  const userId = await getUserId();

  const payload: Record<string, any> = {
    client_id: clientId,
    events: [
      {
        name: eventName,
        params,
      },
    ],
  };

  if (userId) {
    payload.user_id = userId;
  }

  try {
    const res = await fetch(
      `https://www.google-analytics.com/mp/collect?measurement_id=${MEASUREMENT_ID}&api_secret=${API_SECRET}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );

    if (!res.ok) {
      console.warn("[GA4] 이벤트 전송 실패:", await res.text());
    }
  } catch (err) {
    console.error("[GA4] 이벤트 전송 에러:", err);
  }
};

// 화면 진입 이벤트 (선택적 사용)
export const logScreenView = async (screenName: string) => {
  await logEvent("screen_view", {
    firebase_screen: screenName,
    firebase_screen_class: screenName,
  });
};
