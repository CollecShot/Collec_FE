import { ROUTES } from "@/src/constants/routes";
import { CATEGORY_TITLES } from "@constants/categories";
import { useRouter } from "expo-router";
import styled from "styled-components/native";
import Item from "./Item";

type CategoryData = {
  id: string;
  title: string;
  imageUri: string;
  count: number;
};

// TODO: API 연결
const dummyCategories: CategoryData[] = [
  {
    id: "shopping",
    title: CATEGORY_TITLES.shopping,
    imageUri: "https://i.ibb.co/YTjmxwnw/image-2.png",
    count: 10,
  },
  {
    id: "document",
    title: CATEGORY_TITLES.document,
    imageUri: "https://i.ibb.co/zTSWVgz9/image-3.png",
    count: 7,
  },
  {
    id: "deal",
    title: CATEGORY_TITLES.reservation,
    imageUri: "https://i.ibb.co/xtjJX6XG/image-4.png",
    count: 12,
  },
  {
    id: "location",
    title: CATEGORY_TITLES.location,
    imageUri: "https://i.ibb.co/KZ7JLtb/image-5.png",
    count: 4,
  },
  {
    id: "coupon",
    title: CATEGORY_TITLES.coupon,
    imageUri: "https://i.ibb.co/5hqtrdPz/image-6.png",
    count: 15,
  },
  {
    id: "chat",
    title: CATEGORY_TITLES.chat,
    imageUri: "https://i.ibb.co/wNsJDdHJ/image-7.png",
    count: 3,
  },
  {
    id: "music",
    title: CATEGORY_TITLES.music,
    imageUri: "https://i.ibb.co/jvdbCN80/image-8.png",
    count: 8,
  },
  {
    id: "animal",
    title: CATEGORY_TITLES.animal,
    imageUri: "https://i.ibb.co/JwJ0WD7C/Rectangle-6401.png",
    count: 6,
  },
  {
    id: "person",
    title: CATEGORY_TITLES.person,
    imageUri: "https://i.ibb.co/CpLg0RBq/image-9.png",
    count: 9,
  },
  {
    id: "etc",
    title: CATEGORY_TITLES.etc,
    imageUri: "https://i.ibb.co/PsFL8npx/image-10.png",
    count: 2,
  },
];

const Grid: React.FC = () => {
  const router = useRouter();
  return (
    <Container>
      {dummyCategories.map((category) => (
        <Item
          key={category.id}
          title={category.title}
          imageUri={category.imageUri}
          count={category.count}
          onPress={() =>
            router.push({ pathname: ROUTES.GALLERY, params: { categoryId: category.id } })
          }
        />
      ))}
    </Container>
  );
};

export default Grid;

const Container = styled.View`
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: flex-start;
  padding: 15px;
`;
