import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { MdSend } from "react-icons/md";
import CommentCard from "./CommentCard";
import { useSession } from "next-auth/react";
import { useAddComment, useGetComments } from "@/hooks/useComment";
import { TbMessageCircleOff } from "react-icons/tb";
const CommentModal = ({ setCommentModalStatus, commentPostId }) => {
  const { register, handleSubmit, reset } = useForm();
  const { data: session } = useSession();
  const useAddCommentMutation = useAddComment();
  const { isLoading, data: comments, refetch } = useGetComments(commentPostId);
  const onSubmit = (data) => {
    const tempData = { ...data, userId: session.user.id };
    useAddCommentMutation.mutate({ data: tempData, commentPostId });
  };

  useEffect(() => {
    if (useAddCommentMutation.isSuccess) {
      refetch();
      reset();
    }
  }, [useAddCommentMutation.isSuccess]);

  return (
    <div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-white bg-opacity-50 bg-dark-100"
      onClick={() => setCommentModalStatus(false)}
    >
      <section
        className="relative max-w-2xl mx-auto w-full h-[80vh] bg-dark-25 overflow-hidden rounded-lg "
        onClick={(e) => e.stopPropagation()}
      >
        {/* comment container */}
        <ul className="px-4 py-6 space-y-6 overflow-y-auto h-3/4">
          {isLoading ? (
            <>
              <div className="flex gap-2">
                <img
                  src={"./profile.png"}
                  alt={"profile"}
                  className="w-8 h-8 rounded-full "
                />
                <div className="px-4 py-2 overflow-hidden bg-gray-400 bg-opacity-25 rounded-lg w-max">
                  <div className="w-[8rem] h-3 bg-gray-400 bg-opacity-50 mb-2" />
                  <div className="w-[15rem] h-2 bg-gray-400 bg-opacity-50 mb-2" />
                  <div className="w-[12rem] h-2 bg-gray-400 bg-opacity-50" />
                </div>
              </div>
              <div className="flex gap-2">
                <img
                  src={"./profile.png"}
                  alt={"profile"}
                  className="w-8 h-8 rounded-full "
                />
                <div className="px-4 py-2 overflow-hidden bg-gray-400 bg-opacity-25 rounded-lg w-max">
                  <div className="w-[8rem] h-3 bg-gray-400 bg-opacity-50 mb-2" />
                  <div className="w-[12rem] h-2 bg-gray-400 bg-opacity-50 mb-2" />
                  <div className="w-[6rem] h-2 bg-gray-400 bg-opacity-50" />
                </div>
              </div>
              <div className="flex gap-2">
                <img
                  src={"./profile.png"}
                  alt={"profile"}
                  className="w-8 h-8 rounded-full "
                />
                <div className="px-4 py-2 overflow-hidden bg-gray-400 bg-opacity-25 rounded-lg w-max">
                  <div className="w-[8rem] h-3 bg-gray-400 bg-opacity-50 mb-2" />
                  <div className="w-[15rem] h-2 bg-gray-400 bg-opacity-50 mb-2" />
                  <div className="w-[8rem] h-2 bg-gray-400 bg-opacity-50" />
                </div>
              </div>
            </>
          ) : comments.length > 0 ? (
            comments.map((comment) => (
              <CommentCard
                key={comment.id}
                comment={comment}
                refetch={refetch}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center w-full gap-2 py-24">
              <TbMessageCircleOff className="text-[80px] text-gray-400" />
              <h2 className="text-xl font-medium text-gray-400">
                Currently empty...
              </h2>
            </div>
          )}
        </ul>
        <form
          className="absolute bottom-0 w-full p-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex p-4 text-white rounded-lg bg-dark-75">
            <textarea
              id="comment"
              {...register("comment", { required: true })}
              className="bg-transparent resize-none focus:outline-none placeholder:text-gray-400 caret-primary grow"
              placeholder="Enter a comment ..."
              rows={3}
            />
            <button className="self-end text-2xl text-primary hover:opacity-75">
              <MdSend />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default CommentModal;
