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
    await AsyncStorage.setItem(DEVICE_ID_KEY, id);
  }

  return id;
}
