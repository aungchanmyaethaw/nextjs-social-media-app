import { getCurrentDate } from "@/utils/getCurrentDate";
import React, { useEffect, useState } from "react";
import { FaLock, FaGlobeAsia } from "react-icons/fa";
import PostImageContainer from "./PostImageContainer";
import { useSession } from "next-auth/react";
import { BsHeart, BsHeartFill, BsChat } from "react-icons/bs";
import {
  useAddLike,
  useGetLikesByPostId,
  useRemoveLike,
} from "@/hooks/useFavourite";
import { useGetComments } from "@/hooks/useComment";

const PostCard = ({
  post,
  setModalImages,
  setImageModalStatus,
  setModalStart,
  setCommentModalStatus,
  setCommentPostId,
  isProfile = false,
}) => {
  const [imageContainerAvailable, setImageContainerAvailable] = useState(false);
  const [captionDetails, setCaptionDetails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const { data: session } = useSession();

  const { isLoading, data: likes, refetch } = useGetLikesByPostId(post?.id);
  const { isLoading: commentLoading, data: comments } = useGetComments(
    post?.id
  );
  const useAddLikeMutation = useAddLike();
  const useRemoveMutation = useRemoveLike();

  useEffect(() => {
    if (typeof window !== "undefined") {
      setImageContainerAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (useAddLikeMutation.isSuccess || useRemoveMutation.isSuccess) {
      refetch();
    }
  }, [useAddLikeMutation.isSuccess, useRemoveMutation.isSuccess]);

  useEffect(() => {
    if (!isLoading && session) {
      const isLiked = likes.find((like) => like.user.id === session.user.id);

      if (isLiked) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    }
  }, [likes, isLoading, session]);

  const addLike = () => {
    useAddLikeMutation.mutate({ userId: session?.user.id, postId: post?.id });
  };

  const removeLike = () => {
    const isLiked = likes.find((like) => like.user.id === session.user.id);

    useRemoveMutation.mutate({ postId: post.id, likeId: isLiked.id });
  };

  const handleOpenCommentModal = () => {
    setCommentModalStatus(true);
    setCommentPostId(post?.id);
  };

  if (isLoading || commentLoading) {
    return (
      <article className="w-full p-4 rounded-lg bg-dark-25">
        <div className="flex items-center gap-2 mb-6">
          <img
            src="./profile.png"
            className="w-10 h-10 bg-gray-400 bg-opacity-50 rounded-full pointer-events-none"
          />
          <div className="space-y-1">
            <span className="w-[10rem] h-2 bg-gray-400 bg-opacity-50 block" />
            <div className="flex items-center gap-1">
              <FaGlobeAsia size={14} className="text-gray-400" />

              <span className="w-[5rem] h-2 bg-gray-400 bg-opacity-50 block" />
            </div>
          </div>
        </div>
        <div className="mb-6 w-full h-[30rem] bg-gray-400 bg-opacity-50 rounded-lg" />
        <div className="block w-full h-3 mb-3 bg-gray-400 bg-opacity-50" />
        <div className="block w-3/4 h-3 bg-gray-400 bg-opacity-50" />
        <div className="flex py-2 mt-4 border-t border-t-gray-400">
          <div className="flex justify-center basis-1/2">
            <div className="block w-20 h-3 mb-3 bg-gray-400 bg-opacity-50" />
          </div>
          <div className="flex justify-center basis-1/2">
            <div className="block w-20 h-3 mb-3 bg-gray-400 bg-opacity-50" />
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="w-full p-4 rounded-lg bg-dark-25">
      <div className="flex items-center gap-2 mb-6">
        <img
          src={post?.author?.image}
          alt={"profile"}
          className="w-10 h-10 rounded-full pointer-events-none "
        />
        <div className="space-y-1">
          <span className="text-white pointer-events-none">
            {post?.author?.name}
          </span>
          <div className="flex items-center gap-1">
            {post.onlyMe ? (
              <FaLock size={14} className="text-gray-400" />
            ) : (
              <FaGlobeAsia size={14} className="text-gray-400" />
            )}
            {imageContainerAvailable ? (
              <span className="text-xs text-gray-400 ">
                {getCurrentDate(post.updatedAt)}
              </span>
            ) : null}
          </div>
        </div>
        {session?.user?.id === post.authorId ? (
          <div className="flex self-start justify-center px-2 py-1 mt-1 text-xs font-bold rounded-2xl bg-primary">
            me
          </div>
        ) : null}
      </div>
      {post.images.length > 0 && imageContainerAvailable ? (
        <div className="mb-6">
          {
            <PostImageContainer
              images={post.images}
              setImageModalStatus={setImageModalStatus}
              setModalImages={setModalImages}
              setModalStart={setModalStart}
            />
          }
        </div>
      ) : null}
      {post.caption.length < 100 ? (
        <p className="text-white">{post.caption}</p>
      ) : captionDetails ? (
        <p className="text-white">
          {post.caption}{" "}
          <button
            className="ml-2 font-bold hover:text-primary"
            onClick={() => setCaptionDetails(false)}
          >
            Hide
          </button>
        </p>
      ) : (
        <p className="text-white">
          {post.caption.substring(0, 100) + "..."}
          <button
            className="ml-2 font-bold hover:text-primary"
            onClick={() => setCaptionDetails(true)}
          >
            Details
          </button>
        </p>
      )}
      <div className="flex py-2 mt-4 border-t border-t-gray-400">
        {isLiked ? (
          <button
            className="flex items-center justify-center gap-2 py-1 rounded basis-1/2 hover:bg-gray-400 hover:bg-opacity-10"
            onClick={removeLike}
          >
            <BsHeartFill className="text-lg text-primary" />
            <span className="font-medium text-gray-400">{likes?.length}</span>
          </button>
        ) : (
          <button
            className="flex items-center justify-center gap-2 py-1 rounded basis-1/2 hover:bg-gray-400 hover:bg-opacity-10"
            onClick={addLike}
          >
            <BsHeart className="text-lg text-gray-400" />
            <span className="font-medium text-gray-400">{likes?.length}</span>
          </button>
        )}

        <button
          className="flex items-center justify-center gap-2 py-1 basis-1/2 hover:bg-gray-400 hover:bg-opacity-10"
          onClick={handleOpenCommentModal}
        >
          <BsChat className="text-lg text-gray-400" />
          <span className="font-medium text-gray-400">{comments?.length}</span>
        </button>
      </div>
    </article>
  );
};

export default PostCard;
