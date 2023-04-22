import {
  addComment,
  deleteComment,
  editComment,
  getComments,
} from "@/lib/comment";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddComment = () => {
  return useMutation(addComment);
};

export const useDeleteComment = () => {
  return useMutation(deleteComment);
};

export const useEditComment = () => {
  return useMutation(editComment);
};
export const useGetComments = (commentPostId) => {
  return useQuery(["commentsbyposts", commentPostId], () =>
    getComments(commentPostId)
  );
};
