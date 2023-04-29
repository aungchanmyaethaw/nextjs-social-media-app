import Layout from "@/components/Layout";
import { getServerSession } from "next-auth";
import React, { useEffect, useState } from "react";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { useForm } from "react-hook-form";
import {
  useDeleteImage,
  useEditPost,
  useEditPostImageUpload,
} from "@/hooks/usePosts";
import { BsImage } from "react-icons/bs";
import { FaImages } from "react-icons/fa";
import ImageContainer from "@/components/ImageContainer";
import { ClipLoader } from "react-spinners";
import { useRouter } from "next/router";
import prisma from "@/lib/prisma";
import { getPost } from "@/lib/post";

const EditPost = ({ post }) => {
  const { register, handleSubmit, watch, setValue, reset } = useForm();
  const [allImages, setAllImages] = useState([]);
  const [deleteImageId, setDeletImageId] = useState("");

  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const useEditPostMutation = useEditPost();
  const useImageUploadMutation = useEditPostImageUpload();
  const useImageDeleteMuatation = useDeleteImage();

  const imageWatch = watch("images");

  const onSubmit = (data) => {
    useEditPostMutation.mutate({
      postId: post.id,
      caption: data.caption,
      onlyMe: data.onlyMe,
    });
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setValue("images", event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeImage = (imageId, publicId) => {
    useImageDeleteMuatation.mutate({ imageId, publicId });
  };

  useEffect(() => {
    if (useImageUploadMutation.isSuccess) {
      refreshData();
      setValue("images", []);
    }
  }, [useImageUploadMutation.isSuccess]);

  useEffect(() => {
    if (useImageDeleteMuatation.isSuccess) {
      refreshData();
    }
  }, [useImageDeleteMuatation.isSuccess]);

  useEffect(() => {
    let timer;

    reset();
    setAllImages();
    if (useEditPostMutation.isSuccess) {
      timer = setTimeout(() => {
        router.push("/");
      }, 1000);
    }
    return () => clearTimeout(timer);
  }, [useEditPostMutation.isSuccess]);

  useEffect(() => {
    setValue("caption", post.caption);
    setValue("onlyMe", post.onlyMe);
    setAllImages(post.images);
  }, [setValue, post]);

  useEffect(() => {
    if (imageWatch?.length > 0) {
      useImageUploadMutation.mutate({ postId: post.id, images: imageWatch });
    }
  }, [imageWatch]);

  return (
    <Layout>
      <section className="max-w-md p-8 mx-auto mt-12 rounded-lg bg-dark-25 ">
        <h2 className="mb-8 text-2xl text-center text-white">Edit post</h2>

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
            {allImages?.length > 0 ? (
              <ImageContainer
                images={allImages}
                removeImage={removeImage}
                setDeletImageId={setDeletImageId}
              />
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
          {useEditPostMutation.isSuccess || useImageUploadMutation.isLoading ? (
            <div className="fixed py-4 bg-green-400 rounded bottom-8 right-8 w-[15rem]">
              <p className="text-lg font-medium text-center">
                Upload Successful!
              </p>
            </div>
          ) : null}
          {useImageUploadMutation.isLoading ? (
            <div className="fixed py-4 bg-green-400 rounded bottom-8 right-8 w-[15rem]">
              <p className="text-lg font-medium text-center">
                Image Uploading...
              </p>
            </div>
          ) : null}
          {useEditPostMutation.isError ? (
            <div className="fixed py-4 bg-green-400 rounded bottom-8 right-8 w-[15rem]">
              <p className="text-lg font-medium text-center">
                {useEditPostMutation.error.message}
              </p>
            </div>
          ) : null}
          {useImageDeleteMuatation.isLoading ? (
            <div className="fixed py-4 bg-red-400 rounded bottom-8 right-8 w-[15rem]">
              <p className="text-lg font-medium text-center">
                Image Deleting...
              </p>
            </div>
          ) : null}

          <button
            className="px-2 py-2 font-medium rounded bg-primary text-dark-100 hover:bg-yellow-400"
            disabled={
              useEditPostMutation.isLoading || useImageUploadMutation.isLoading
            }
          >
            {useEditPostMutation.isLoading ? (
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
};

export default EditPost;

export async function getServerSideProps(context) {
  const { id } = context.query;
  const session = await getServerSession(context.req, context.res, authOptions);
  let post = await getPost(prisma, id);
  post = JSON.parse(JSON.stringify(post));

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
      },
    };
  }

  return {
    props: { session, post },
  };
}
