import { ALBUM_NAME_TO_KEY, CATEGORY_TITLES } from "@/src/constants/categories";
import { UserAlbum } from "../apis/getUserAlbums";

export interface CategoryItem {
  id: string;
  key: keyof typeof CATEGORY_TITLES;
  title: string;
  imageUri: string;
  count: number;
}

// 표시 순서 정의 (원하는 순서대로 key를 나열)
export const CATEGORY_ORDER: (keyof typeof CATEGORY_TITLES)[] = [
  "shopping",
  "document",
  "reservation",
  "location",
  "coupon",
  "chat",
  "music",
  "animal",
  "person",
  "etc",
];

// 서버에서 받은 Album 배열을 Grid 컴포넌트에 넘길 CategoryItem 배열로 변환
export function mapAlbumsToCategories(albums: UserAlbum[]): CategoryItem[] {
  return albums.map((a) => {
    const key = ALBUM_NAME_TO_KEY[a.albumName]!;
    return {
      id: a.albumId.toString(),
      key,
      title: CATEGORY_TITLES[key],
      imageUri: a.latestPhotoFilepath,
      count: a.photoCount,
    };
  });
}

// 카테고리 배열을 CATEGORY_ORDER 기준으로 정렬
export function sortCategories(categories: CategoryItem[]): CategoryItem[] {
  return categories
    .slice()
    .sort((a, b) => CATEGORY_ORDER.indexOf(a.key) - CATEGORY_ORDER.indexOf(b.key));
}
