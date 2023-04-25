import { useEditProfile } from "@/hooks/useProfile";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { BsPencilSquare } from "react-icons/bs";
import { ClipLoader } from "react-spinners";

const ProfileEditModal = ({ setProfileModalStatus, session, refreshData }) => {
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const profileEditMutation = useEditProfile();

  const { user } = session;

  useEffect(() => {
    setValue("name", user?.name);
    setValue("username", user?.username);
    setValue("email", user?.email);
  }, [setValue, user]);

  const imageWatch = watch("image");

  const onSubmit = (data) => {
    let tempData;

    if (Array.from(imageWatch).length > 0) {
      tempData = {
        userId: user.id,
        username: data.username,
        image: data.image[0],
      };
    } else {
      tempData = {
        userId: user.id,
        username: data.username,
      };
    }
    profileEditMutation.mutate(tempData);
  };

  useEffect(() => {
    if (profileEditMutation.isSuccess) {
      refreshData();
      setProfileModalStatus(false);
    }
  }, [profileEditMutation.isSuccess]);

  console.log(imageWatch);

  return (
    <div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-white bg-opacity-50 bg-dark-100"
      onClick={() => setProfileModalStatus(false)}
    >
      <section
        className="relative max-w-2xl mx-auto w-full h-[80vh] bg-dark-25 overflow-hidden rounded-lg "
        onClick={(e) => e.stopPropagation()}
      >
        <form
          className="flex flex-col items-center py-8"
          onSubmit={handleSubmit(onSubmit)}
        >
          <img
            src={imageWatch ? URL.createObjectURL(imageWatch[0]) : user.image}
            alt=""
            className="object-cover w-[96px] h-[96px] mb-2 overflow-hidden rounded-full"
          />
          <label
            htmlFor="image"
            className="mt-4  flex items-center gap-2 px-6 py-2 mx-auto  rounded bg-primary hover:bg-yellow-300 !text-dark-100 font-semibold"
          >
            Choose Image
          </label>
          <div className="flex flex-col gap-2 text-white w-[30rem]  mb-6">
            <input
              id="image"
              type="file"
              {...register("image")}
              className="hidden"
            />
          </div>
          <div className="flex flex-col gap-2 text-white w-[30rem] mb-6">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              {...register("username", { required: true })}
              className="p-4 text-white rounded-lg bg-dark-75 focus:outline-none placeholder:text-gray-400 caret-primary"
              placeholder="Enter your username ..."
            />
          </div>
          <div className="flex flex-col gap-2 text-white w-[30rem] mb-6">
            <label htmlFor="name">Name</label>
            <input
              id="name"
              type="text"
              {...register("name", { required: true })}
              className="p-4 text-white rounded-lg cursor-not-allowed bg-dark-100 focus:outline-none placeholder:text-gray-400 caret-primary"
              readOnly
            />
          </div>
          <div className="flex flex-col gap-2 text-white w-[30rem] ">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              {...register("email", { required: true })}
              className="p-4 text-white rounded-lg cursor-not-allowed bg-dark-100 focus:outline-none placeholder:text-gray-400 caret-primary"
              readOnly
            />
          </div>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              className="flex items-center gap-2 px-8 py-2 mx-auto  rounded bg-primary hover:bg-yellow-300 !text-dark-100 font-semibold"
              type="submit"
            >
              {profileEditMutation.isLoading ? (
                <>
                  <ClipLoader size={12} />
                  Saving...
                </>
              ) : (
                <>
                  <BsPencilSquare />
                  Save
                </>
              )}
            </button>
            <button
              className="flex items-center px-8 py-2 font-semibold bg-gray-400 rounded hover:bg-gray-500 text-dark-100"
              onClick={() => setProfileModalStatus(false)}
              type="button"
            >
              Cancel
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProfileEditModal;
