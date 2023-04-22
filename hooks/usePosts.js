import { addPost } from "@/lib/addPost";
import { useMutation, useQuery } from "@tanstack/react-query";

export const useAddPost = () => {
  return useMutation(addPost);
};
