import { addPost } from "@/lib/post";
import { useMutation } from "@tanstack/react-query";

export const useAddPost = () => {
  return useMutation(addPost);
};
