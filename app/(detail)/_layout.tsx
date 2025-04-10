import DetailHeader from "@/src/components/header/Detail";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <DetailHeader />,
      }}
    />
  );
}
