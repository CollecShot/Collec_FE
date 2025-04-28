import { registerDevice } from "@apis/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Crypto from "expo-crypto";

const DEVICE_ID_KEY = "deviceUniqueId";

export async function getOrCreateDeviceId(): Promise<string> {
  // 1) AsyncStorage에 저장된 ID 확인
  let id = await AsyncStorage.getItem(DEVICE_ID_KEY);
  console.log("[deviceId] stored id:", id);

  if (!id) {
    // 2) expo-crypto의 randomUUID()로 새 UUID 생성
    id = Crypto.randomUUID();
    console.log("[deviceId] generated new id:", id);

    try {
      // 3) 새로 생성한 UUID를 서버에 등록
      const data = await registerDevice(id);
      console.log("[deviceId] register API response:", data);

      // 4) 등록 성공 후 AsyncStorage에 저장
      await AsyncStorage.setItem(DEVICE_ID_KEY, id);
    } catch (error) {
      console.error("[deviceId] Error registering device ID:", error);
      throw error;
    }
  }

  return id;
}
