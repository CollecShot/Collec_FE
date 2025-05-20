import GalleryHeader from "@components/header/Gallery"; // 갤러리용 헤더 추가
import MainHeader from "@components/header/Main";
import { Stack, useLocalSearchParams } from "expo-router";

export default function MainLayout() {
  const { categoryId } = useLocalSearchParams<{ categoryId?: string }>();

  return (
    <Stack
      screenOptions={{
        header: (props) =>
          categoryId ? (
            <GalleryHeader {...props} categoryId={categoryId} />
          ) : (
            <MainHeader {...props} />
          ),
      }}
    />
  );
}
