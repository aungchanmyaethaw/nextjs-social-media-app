import { addLike, getLikesByPost, removeLike } from "@/lib/favourite";
import { useMutation, useQuery } from "@tanstack/react-query";
export const useGetLikesByPostId = (postId) => {
  return useQuery(["likesbypostid", postId], () => getLikesByPost(postId));
};

export const useAddLike = () => {
  return useMutation(addLike);
};

export const useRemoveLike = () => {
  return useMutation(removeLike);
};
