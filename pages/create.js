import Layout from "@/components/Layout";
import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "./api/auth/[...nextauth]";
import { useForm } from "react-hook-form";
import { useSession } from "next-auth/react";
import { useAddPost } from "@/hooks/usePosts";
import { BsImage, BsTrashFill } from "react-icons/bs";
export default function Create() {
  const { register, handleSubmit, watch, setValue } = useForm();
  const { data: session } = useSession();
  const imageWatch = watch("image");
  const usePostMutation = useAddPost();

  const onSubmit = (data) => {
    const tempData = { ...data, id: session.user.id };
    usePostMutation.mutate(tempData);
  };

  const handleDrop = (event) => {
    event.preventDefault();

    setValue("image", event.dataTransfer.files);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const removeImage = () => {
    setValue("image", []);
  };

  return (
    <Layout>
      <section className="max-w-md p-8 mx-auto mt-12 rounded-lg bg-dark-25 ">
        <h2 className="mb-8 text-2xl text-center text-white">Add a post</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
          <div className="flex flex-col gap-4 text-white  w-full h-[20rem] relative  overflow-hidden">
            <input
              type="file"
              {...register("image")}
              className="hidden"
              id="image"
            />
            {imageWatch?.[0] ? (
              <>
                <img
                  src={URL.createObjectURL(imageWatch?.[0])}
                  alt="image"
                  className="object-cover w-full h-full rounded-lg"
                />
                <button
                  className="absolute z-50 flex items-center justify-center w-8 h-8 bg-red-200 rounded right-4 top-4"
                  onClick={removeImage}
                >
                  <BsTrashFill className="text-red-600 " />
                </button>
              </>
            ) : (
              <label
                className="flex items-center justify-center w-full h-full border border-dashed rounded-lg bg-opacity-30 border-primary"
                htmlFor="image"
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
            <label htmlFor="image">
              Caption <span className="text-primary">*</span>{" "}
            </label>
            <textarea
              type="text"
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
          <button className="px-2 py-2 font-medium rounded bg-primary text-dark-100 hover:bg-yellow-400">
            Add
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
