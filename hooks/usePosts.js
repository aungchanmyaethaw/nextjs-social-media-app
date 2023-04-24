import { addPostHide, removePostHide } from "@/lib/hidepost";
import {
  addPost,
  deleteImage,
  deletePost,
  editPost,
  editPostImageUpload,
} from "@/lib/post";
import { addSave, getSavedPosts, removeSave } from "@/lib/save";
import { useMutation, useQuery } from "@tanstack/react-query";

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

export const useAddHidePost = () => {
  return useMutation(addPostHide);
};
export const useRemoveHidePost = () => {
  return useMutation(removePostHide);
};

export const useGetSavesbyPost = (postId) => {
  return useQuery(["getsavesbypost", postId], () => getSavedPosts(postId));
};

export const useAddSave = () => {
  return useMutation(addSave);
};

export const useRemoveSave = () => {
  return useMutation(removeSave);
};
