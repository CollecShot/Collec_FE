import BinHeader from "@/src/components/header/Bin";
import { Stack } from "expo-router";

export default function BinLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <BinHeader />,
      }}
    />
  );
}
