import { editProfile } from "@/lib/profile";
import { useMutation } from "@tanstack/react-query";

export const useEditProfile = () => {
  return useMutation(editProfile);
};
