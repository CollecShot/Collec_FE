import MainHeader from "@/src/components/header/Main";
import { Stack } from "expo-router";

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        header: (props) => <MainHeader {...props} />,
      }}
    />
  );
}
