import DetailHeader from "@/src/components/header/Detail";
import DetailBinHeader from "@/src/components/header/DetailBin";
import { Stack, useLocalSearchParams } from "expo-router";

export default function MainLayout() {
  const { fromBin } = useLocalSearchParams<{ fromBin?: string }>();

  return (
    <Stack
      screenOptions={{
        // fromBin이 "1"이면 휴지통 전용 헤더, 아니면 기본 헤더
        header: () => (fromBin === "1" ? <DetailBinHeader /> : <DetailHeader />),
      }}
    />
  );
}
