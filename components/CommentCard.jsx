import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { BsFillTrashFill, BsPencilSquare } from "react-icons/bs";
import { useDeleteComment, useEditComment } from "@/hooks/useComment";
import { getCurrentDate } from "@/utils/getCurrentDate";
import { useForm } from "react-hook-form";
const CommentCard = ({ comment, refetch }) => {
  const { data: session } = useSession();
  const [deleteStatus, setDeleteStatus] = useState(false);
  const [editStatus, setEditStatus] = useState(false);
  const useDeleteMutation = useDeleteComment();
  const useEditMutation = useEditComment();
  const { register, handleSubmit, reset, setValue } = useForm();

  const handleDelete = () => {
    const tempData = { commentPostId: comment.post.id, commentId: comment.id };
    useDeleteMutation.mutate(tempData);
  };

  useEffect(() => {
    if (useDeleteMutation.isSuccess || useEditMutation.isSuccess) {
      setEditStatus(false);
      refetch();
    }
  }, [useDeleteMutation.isSuccess, useEditMutation.isSuccess]);

  useEffect(() => {
    if (editStatus) {
      setValue("editcomment", comment.comment);
    }
  }, [editStatus, setValue, comment]);

  const onSubmit = (data) => {
    const tempData = {
      commentPostId: comment.post.id,
      comment: data.editcomment,
      commentId: comment.id,
    };
    useEditMutation.mutate(tempData);
  };

  return (
    <div className="flex gap-2 ">
      <img
        src={comment?.user?.image || "./profile.png"}
        alt={"profile"}
        className="w-8 h-8 rounded-full "
      />
      <div className="px-4 py-2 overflow-hidden bg-gray-400 bg-opacity-25 rounded-lg w-max">
        <div className="flex items-center gap-2">
          <span className="font-medium text-white">{comment.user.name}</span>
          <span className="text-xs text-gray-200">
            {getCurrentDate(comment.updatedAt)}
          </span>
        </div>
        {editStatus ? (
          <form className="w-full mt-4 mb-2" onSubmit={handleSubmit(onSubmit)}>
            <div className="flex p-4 text-white rounded-lg bg-dark-75">
              <textarea
                id="comment"
                {...register("editcomment", { required: true })}
                className="w-full bg-transparent resize-none focus:outline-none placeholder:text-gray-400 caret-primary grow"
                placeholder="Enter a comment ..."
                rows={3}
                cols={50}
              />
              <button className="self-end text-2xl text-primary hover:opacity-75">
                <BsPencilSquare />
              </button>
            </div>
          </form>
        ) : (
          <p className="mt-2 text-sm leading-5">{comment.comment}</p>
        )}

        {session.user.id === comment.user.id ? (
          <div className="flex items-center gap-2 pt-2 ">
            {!editStatus ? (
              <button
                className="flex items-center gap-1 text-sm font-bold text-gray-200 hover:text-red-400"
                onClick={() => setDeleteStatus(true)}
              >
                <BsFillTrashFill size={12} />
                Delete
              </button>
            ) : null}
            {!deleteStatus ? (
              editStatus ? (
                <button
                  className="flex items-center px-2 py-1 text-xs font-bold bg-gray-400 rounded hover:bg-gray-500 text-dark-100"
                  onClick={() => setEditStatus(false)}
                >
                  Cancel
                </button>
              ) : (
                <button
                  className="flex items-center gap-1 text-sm font-bold text-gray-200 hover:text-primary"
                  onClick={() => setEditStatus(true)}
                >
                  <BsPencilSquare size={12} />
                  Edit
                </button>
              )
            ) : null}
          </div>
        ) : null}
        {deleteStatus ? (
          <div className="mt-3 space-y-2">
            <h4 className="font-semibold">Are you Sure?</h4>
            <div className="flex items-center gap-2">
              <button
                className="flex items-center gap-1 px-2 py-1 text-xs font-bold text-white bg-red-500 rounded hover:bg-red-600"
                onClick={handleDelete}
              >
                <BsFillTrashFill size={12} />
                Delete
              </button>
              <button
                className="flex items-center px-2 py-1 text-xs font-bold bg-gray-400 rounded hover:bg-gray-500 text-dark-100"
                onClick={() => setDeleteStatus(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CommentCard;
