import MoveHeader from "@/src/components/header/Move";
import { Stack } from "expo-router";

export default function MoveLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <MoveHeader />,
      }}
    />
  );
}
