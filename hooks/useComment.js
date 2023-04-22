import { addComment, getComments } from "@/lib/comment";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddComment = () => {
  return useMutation(addComment);
};
export const useGetComments = (commentPostId) => {
  return useQuery(["commentsbyposts", commentPostId], () =>
    getComments(commentPostId)
  );
};
