import { useDeleteComment } from "@/hooks/useComment";
import { useDeletePost } from "@/hooks/usePosts";
import React, { useEffect } from "react";
import { BsFillTrashFill } from "react-icons/bs";
import { ClipLoader } from "react-spinners";
const DeletePostModal = ({
  setDeleteModalStatus,
  deletePostId,
  refreshData,
}) => {
  const useDeletePostMutation = useDeletePost();
  console.log(deletePostId);
  const handleDelete = () => {
    useDeletePostMutation.mutate(deletePostId);
  };

  useEffect(() => {
    if (useDeletePostMutation.isSuccess) {
      refreshData();
      setDeleteModalStatus(false);
    }
  }, [useDeletePostMutation.isSuccess]);

  return (
    <div
      className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-screen text-white bg-opacity-75 bg-dark-100"
      onClick={() => setDeleteModalStatus(false)}
    >
      <section
        className="relative max-w-lg mx-auto w-full h-[320px] bg-dark-25 overflow-hidden rounded-lg flex flex-col justify-center items-center"
        onClick={(e) => e.stopPropagation()}
      >
        <BsFillTrashFill className="text-gray-400 text-[80px] mb-4" />
        <p className="mb-4 text-lg font-medium">
          Are you sure you want to delete this post!
        </p>
        <div>
          <div className="flex items-center gap-4">
            <button
              className="flex items-center gap-1 px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600 disabled:bg-red-400 "
              onClick={handleDelete}
              disabled={useDeletePostMutation.isLoading}
            >
              {useDeletePostMutation.isLoading ? (
                <>
                  <ClipLoader color="white" size={12} />
                  Deleting...
                </>
              ) : (
                <>
                  <BsFillTrashFill />
                  Delete
                </>
              )}
            </button>
            <button
              className="flex items-center px-4 py-2 font-bold bg-gray-400 rounded hover:bg-gray-500 text-dark-100"
              onClick={() => setDeleteModalStatus(false)}
            >
              Cancel
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default DeletePostModal;
