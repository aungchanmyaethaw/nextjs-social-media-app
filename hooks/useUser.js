import { getUsers } from "@/lib/search";
import { useQuery } from "@tanstack/react-query";

export const useGetUsers = (query) => {
  return useQuery(["getsavesbypost", query], () => getUsers(query));
};
