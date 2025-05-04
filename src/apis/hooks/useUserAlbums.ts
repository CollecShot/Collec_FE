import { useQuery } from "@tanstack/react-query";
import { fetchUserAlbums, UserAlbum } from "../getUserAlbums";

export const useUserAlbums = () => {
  return useQuery<UserAlbum[], Error>({
    queryKey: ["userAlbums"],
    queryFn: fetchUserAlbums,
    staleTime: 5 * 60 * 1000,
  });
};
