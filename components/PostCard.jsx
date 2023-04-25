import { useRef } from "react";
import { getCurrentDate } from "@/utils/getCurrentDate";
import React, { useEffect, useState } from "react";
import { FaLock, FaGlobeAsia } from "react-icons/fa";
import { HiXMark } from "react-icons/hi2";
import { useSession } from "next-auth/react";
import {
  BsHeart,
  BsHeartFill,
  BsChat,
  BsThreeDots,
  BsFillTrashFill,
  BsPencilSquare,
  BsBookmark,
} from "react-icons/bs";
import { TbBookmarkOff } from "react-icons/tb";
import {
  useAddLike,
  useGetLikesByPostId,
  useRemoveLike,
} from "@/hooks/useFavourite";
import { useGetComments } from "@/hooks/useComment";
import PostImageContainer from "./PostImageContainer";
import Link from "next/link";
import {
  useAddHidePost,
  useAddSave,
  useGetSavesbyPost,
  useRemoveHidePost,
  useRemoveSave,
} from "@/hooks/usePosts";

const PostCard = ({
  post,
  setModalImages,
  setImageModalStatus,
  setModalStart,
  setCommentModalStatus,
  setCommentPostId,
  setDeletePostId,
  setDeleteModalStatus,
  isSavePage,
}) => {
  const [imageContainerAvailable, setImageContainerAvailable] = useState(false);
  const [captionDetails, setCaptionDetails] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [optionsStatus, setOptionsStatus] = useState(false);
  const [isPostHide, setIsPostHide] = useState(false);
  const [hidePostId, setHidePostId] = useState("");
  const { data: session } = useSession();

  const { isLoading, data: likes, refetch } = useGetLikesByPostId(post?.id);
  const { isLoading: commentLoading, data: comments } = useGetComments(
    post?.id
  );
  const {
    isLoading: saveLoading,
    data: saves,
    refetch: savesRefetch,
  } = useGetSavesbyPost(post?.id);

  const useAddLikeMutation = useAddLike();
  const useRemoveLikeMutation = useRemoveLike();
  const useAddHideMutation = useAddHidePost();
  const useRemoveHideMutation = useRemoveHidePost();
  const useAddSaveMutation = useAddSave();
  const useRemoveSaveMutation = useRemoveSave();

  const optionsRef = useRef();
  const buttonRef = useRef();

  // ---------- effects  ---------- //

  useEffect(() => {
    const event = document.addEventListener("click", (event) => {
      if (event.target === buttonRef.current) {
        setOptionsStatus(true);
        return;
      }

      if (event.target !== optionsRef.current) {
        setOptionsStatus(false);
      }
    });

    return () => document.removeEventListener("click", event);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setImageContainerAvailable(true);
    }
  }, []);

  useEffect(() => {
    if (useAddSaveMutation.isSuccess || useRemoveSaveMutation.isSuccess) {
      console.count("render");
      savesRefetch();
    }
  }, [useAddSaveMutation.isSuccess, useRemoveSaveMutation.isSuccess]);

  useEffect(() => {
    if (useAddLikeMutation.isSuccess || useRemoveLikeMutation.isSuccess) {
      refetch();
    }
  }, [useAddLikeMutation.isSuccess, useRemoveLikeMutation.isSuccess]);

  useEffect(() => {
    if (useRemoveHideMutation.isSuccess) {
      setIsPostHide(false);
    }
  }, [useRemoveHideMutation.isSuccess]);

  useEffect(() => {
    if (useAddHideMutation.isSuccess) {
      setIsPostHide(true);
      setHidePostId(useAddHideMutation.data);
    }
  }, [useAddHideMutation.isSuccess]);

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

  useEffect(() => {
    if (!saveLoading && session) {
      const isSaved = saves.find((save) => save.user.id === session.user.id);

      if (isSaved) {
        setIsSaved(true);
      } else {
        setIsSaved(false);
      }
    }
  }, [session, saveLoading, saves]);

  // ---------- handle func ---------- //

  const addLike = () => {
    useAddLikeMutation.mutate({ userId: session?.user.id, postId: post?.id });
  };

  const removeLike = () => {
    const isLiked = likes.find((like) => like.user.id === session.user.id);

    useRemoveLikeMutation.mutate({ postId: post.id, likeId: isLiked.id });
  };

  const addSave = () => {
    useAddSaveMutation.mutate({ userId: session?.user.id, postId: post?.id });
  };

  const removeSave = () => {
    const isSaved = saves.find((save) => save.user.id === session.user.id);

    useRemoveSaveMutation.mutate({ postId: post.id, savedId: isSaved.id });
  };

  const handleOpenCommentModal = () => {
    setCommentModalStatus(true);
    setCommentPostId(post?.id);
  };

  const handleOpenDeletePostModal = () => {
    const imagePublicIds = post.images.map((image) => image.publicId);
    setDeletePostId({ postId: post?.id, imagePublicIds });
    setDeleteModalStatus(true);
  };

  const handleHidePost = () => {
    useAddHideMutation.mutate({ userId: session.user.id, postId: post.id });
  };

  const handleRemoveHidePost = () => {
    useRemoveHideMutation.mutate(hidePostId);
  };

  if (isLoading || commentLoading || saveLoading) {
    return (
      <article className="w-full p-4 rounded-lg bg-dark-25">
        <div className="flex items-center gap-2 mb-6">
          <img
            src="./profile.png"
            className="w-10 h-10 bg-gray-400 bg-opacity-25 rounded-full pointer-events-none"
          />
          <div className="space-y-1">
            <span className="w-[10rem] h-2 bg-gray-400 bg-opacity-25 block" />
            <div className="flex items-center gap-1">
              <FaGlobeAsia size={14} className="text-gray-400" />

              <span className="w-[5rem] h-2 bg-gray-400 bg-opacity-25 block" />
            </div>
          </div>
        </div>
        <div className="mb-6 w-full h-[30rem] bg-gray-400 bg-opacity-25 rounded-lg" />
        <div className="block w-full h-3 mb-3 bg-gray-400 bg-opacity-25" />
        <div className="block w-3/4 h-3 bg-gray-400 bg-opacity-25" />
        <div className="flex py-2 mt-4 border-t border-t-gray-400">
          <div className="flex justify-center basis-1/2">
            <div className="block w-20 h-3 mb-3 bg-gray-400 bg-opacity-25" />
          </div>
          <div className="flex justify-center basis-1/2">
            <div className="block w-20 h-3 mb-3 bg-gray-400 bg-opacity-25" />
          </div>
        </div>
      </article>
    );
  }

  if (isPostHide) {
    return (
      <article className="w-full p-4 h-[10rem] rounded-lg bg-dark-25">
        <div className="flex flex-col items-center justify-center h-full gap-4 ">
          <h2 className="text-2xl font-thin text-white">Post hide</h2>
          <button
            className="flex items-center gap-2 px-4 py-2 text-lg text-white rounded w-max bg-dark-50 hover:text-primary hover:bg-dark-50"
            onClick={handleRemoveHidePost}
          >
            Unhide Post
          </button>
        </div>
      </article>
    );
  }

  return (
    <article className="w-full p-4 rounded-lg bg-dark-25">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-6">
          <img
            src={post?.author?.image}
            alt={"profile"}
            className="block w-10 h-10 rounded-full pointer-events-none"
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
        <div className="relative" ref={optionsRef}>
          <button
            className="p-2 text-xl text-white rounded-full hover:bg-gray-400 hover:bg-opacity-25"
            onClick={() => {
              setOptionsStatus(true);
            }}
            ref={buttonRef}
          >
            <BsThreeDots className="pointer-events-none" />
          </button>
          {optionsStatus ? (
            <div className="absolute right-0 z-10 min-w-[10rem] p-4 shadow-sm rounded bg-dark-75 space-y-3">
              {session?.user?.id === post.authorId ? (
                <>
                  <button
                    className="flex items-center w-full gap-2 p-2 text-sm text-white rounded bg-dark-50 hover:text-red-400 hover:bg-dark-50"
                    onClick={handleOpenDeletePostModal}
                  >
                    <BsFillTrashFill />
                    Delete post
                  </button>
                  <Link
                    href={`/edit/${post?.id}`}
                    className="flex items-center gap-2 p-2 text-sm text-white rounded bg-dark-50 hover:text-primary hover:bg-dark-25"
                  >
                    <BsPencilSquare />
                    Edit post
                  </Link>
                </>
              ) : (
                <>
                  {isSaved ? (
                    <button
                      className="flex items-center w-full gap-1 p-2 text-sm text-white rounded bg-dark-50 hover:text-primary hover:bg-dark-25"
                      onClick={removeSave}
                      disabled={useRemoveSaveMutation.isLoading}
                    >
                      <TbBookmarkOff className="text-lg " />
                      Unsave post
                    </button>
                  ) : (
                    <button
                      className="flex items-center w-full gap-1 p-2 text-sm text-white rounded bg-dark-50 hover:text-primary hover:bg-dark-25"
                      onClick={addSave}
                      disabled={useAddSaveMutation.isLoading}
                    >
                      <BsBookmark />
                      Save post
                    </button>
                  )}
                  {!isSavePage ? (
                    <button
                      className="flex items-center w-full gap-1 p-2 text-sm text-white rounded bg-dark-50 hover:text-red-400 hover:bg-dark-50"
                      onClick={handleHidePost}
                    >
                      <HiXMark className="text-lg " />
                      Hide post
                    </button>
                  ) : null}
                </>
              )}
            </div>
          ) : null}
        </div>
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
