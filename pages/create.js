import Layout from "@/components/Layout";
import { getServerSession } from "next-auth";
import React, { useEffect } from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { useForm } from "react-hook-form";
import { useAddPost } from "@/hooks/usePosts";
import { BsImage, BsTrashFill } from "react-icons/bs";
import { FaImages } from "react-icons/fa";
import ImageContainer from "@/components/ImageContainer";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";
export default function Create({ session }) {
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const router = useRouter();
  const imageWatch = watch("images");
  const usePostMutation = useAddPost();

  const onSubmit = (data) => {
    const tempData = { ...data, id: session.user.id };
    usePostMutation.mutate(tempData);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setValue("images", event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeImage = (index) => {
    const filteredImages = Array.from(imageWatch).filter(
      (_, currentIndex) => currentIndex !== index
    );

    setValue("images", filteredImages);
  };

  useEffect(() => {
    let timer;

    reset();
    if (usePostMutation.isSuccess) {
      timer = setTimeout(() => {
        router.push("/");
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [usePostMutation.isSuccess]);

  return (
    <Layout>
      <section className="max-w-md p-8 mx-auto mt-12 rounded-lg bg-dark-25 ">
        <h2 className="mb-8 text-2xl text-center text-white">Add a post</h2>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col gap-8"
          encType="multipart/form-data"
        >
          <div className="flex flex-col gap-4 text-white  w-full h-[23rem] relative  overflow-hidden">
            <div>
              <label
                htmlFor="images"
                className="flex items-center justify-center w-12 h-12 rounded-full cursor-pointer bg-dark-100 hover:text-primary hover:bg-opacity-75"
              >
                <FaImages />
              </label>
            </div>

            <input
              type="file"
              {...register("images")}
              multiple
              id="images"
              className="absolute top-0 right-0 hidden"
            />
            {imageWatch?.[0] ? (
              <ImageContainer images={imageWatch} removeImage={removeImage} />
            ) : (
              <label
                className="flex items-center justify-center w-full h-full border border-dashed rounded-lg bg-opacity-30 border-primary"
                htmlFor="images"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
              >
                <div className="flex flex-col items-center gap-4">
                  <BsImage size={48} className="text-gray-400" />
                  <span className="text-gray-400">
                    Drag and Drop or Click...
                  </span>
                </div>
              </label>
            )}
          </div>

          <div className="flex flex-col gap-2 text-white">
            <label htmlFor="caption">
              Caption <span className="text-primary">*</span>{" "}
            </label>
            <textarea
              id="caption"
              {...register("caption", { required: true })}
              className="p-4 text-white rounded-lg resize-none bg-dark-75 focus:outline-none placeholder:text-gray-400 caret-primary"
              placeholder="Enter a caption ..."
              rows={3}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="mr-2 text-white ">
              Who can see this post...?
            </label>

            <select
              {...register("onlyMe")}
              className="w-full p-4 text-white rounded-lg bg-dark-75 "
            >
              <option value={false}>The World...!</option>
              <option value={true}>Only me</option>
            </select>
          </div>
          {usePostMutation.isSuccess ? (
            <div className="fixed py-4 bg-green-400 rounded bottom-8 right-8 w-[15rem]">
              <p className="text-lg font-medium text-center">
                Upload Successful!
              </p>
            </div>
          ) : null}
          {usePostMutation.isError ? (
            <div className="fixed py-4 bg-green-400 rounded bottom-8 right-8 w-[15rem]">
              <p className="text-lg font-medium text-center">
                {usePostMutation.error.message}
              </p>
            </div>
          ) : null}
          <button
            className="px-2 py-2 font-medium rounded bg-primary text-dark-100 hover:bg-yellow-400"
            disabled={usePostMutation.isLoading}
          >
            {usePostMutation.isLoading ? (
              <div className="flex items-center justify-center gap-2 ">
                <ClipLoader color="black" size={14} />
                <span>Uploading...</span>
              </div>
            ) : (
              <span>Upload</span>
            )}
          </button>
        </form>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
      },
    };
  }

  return {
    props: { session },
  };
}
