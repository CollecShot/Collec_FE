import SearchHeader from "@/src/components/header/Search";
import { Stack } from "expo-router";

export default function SearchLayout() {
  return (
    <Stack
      screenOptions={{
        header: () => <SearchHeader />,
      }}
    />
  );
}
