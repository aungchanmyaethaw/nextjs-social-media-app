import { getCurrentDate } from "@/utils/getCurrentDate";
import React, { useEffect, useState } from "react";
import { FaLock, FaGlobeAsia } from "react-icons/fa";
import PostImageContainer from "./PostImageContainer";
const PostCard = ({ post }) => {
  const [imageContainerAvailable, setImageContainerAvailable] = useState(false);
  const [captionDetails, setCaptionDetails] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setImageContainerAvailable(true);
    }
  }, []);

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
      </div>
      {post.images.length > 0 && imageContainerAvailable ? (
        <div className="mb-6">
          {<PostImageContainer images={post.images} />}
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
    </article>
  );
};

export default PostCard;
