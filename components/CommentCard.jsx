import React from "react";
const CommentCard = ({ comment }) => {
  return (
    <div className="flex gap-2 ">
      <img
        src={comment?.user?.image || "./profile.png"}
        alt={"profile"}
        className="w-8 h-8 rounded-full "
      />
      <div className="px-4 py-2 overflow-hidden bg-gray-400 bg-opacity-25 rounded-lg w-max">
        <span className="font-medium text-white">{comment.user.name}</span>
        <p className="mt-2 text-sm leading-5">{comment.comment}</p>
      </div>
    </div>
  );
};

export default CommentCard;
