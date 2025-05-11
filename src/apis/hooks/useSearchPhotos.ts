import { SearchPhoto, searchPhotos } from "@/src/apis/search";
import { useQuery } from "@tanstack/react-query";

export const useSearchPhotos = (keyword: string, enabled: boolean) =>
  useQuery<SearchPhoto[], Error>({
    queryKey: ["searchPhotos", keyword],
    queryFn: () => searchPhotos(keyword),
    enabled,
  });
