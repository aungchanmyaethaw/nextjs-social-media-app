import { addPost } from "@/lib/addPost";
import { useMutation } from "@tanstack/react-query";

export const useAddPost = () => {
  return useMutation(addPost);
};
