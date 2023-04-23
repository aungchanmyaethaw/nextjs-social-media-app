import {
  addPost,
  deleteImage,
  deletePost,
  editPost,
  editPostImageUpload,
} from "@/lib/post";
import { useMutation } from "@tanstack/react-query";

export const useAddPost = () => {
  return useMutation(addPost);
};

export const useEditPost = () => {
  return useMutation(editPost);
};

export const useDeletePost = () => {
  return useMutation(deletePost);
};

export const useEditPostImageUpload = () => {
  return useMutation(editPostImageUpload);
};

export const useDeleteImage = () => {
  return useMutation(deleteImage);
};
