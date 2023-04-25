import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import ImageModal from "./ImageModal";
import CommentModal from "./CommentModal";
import DeletePostModal from "./DeletePostModal";

const PostContainer = ({ posts, refreshData, isSavePage = false }) => {
  const [imageModalStatus, setImageModalStatus] = useState(false);
  const [commentModalStatus, setCommentModalStatus] = useState(false);
  const [commentPostId, setCommentPostId] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalStart, setModalStart] = useState(0);
  const [deleteModalStatus, setDeleteModalStatus] = useState(false);
  const [deletePostId, setDeletePostId] = useState({
    postId: "",
    imagePublicIds: [],
  });

  useEffect(() => {
    if (imageModalStatus || commentModalStatus || deleteModalStatus) {
      document.body.style.maxHeight = "100vh";
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.maxHeight = "";
      document.body.style.overflowY = "";
    }
  }, [imageModalStatus, commentModalStatus, deleteModalStatus]);

  return (
    <section className="flex flex-col items-center max-w-2xl gap-4 p-4 mx-auto ">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          setModalImages={setModalImages}
          setImageModalStatus={setImageModalStatus}
          setModalStart={setModalStart}
          setCommentModalStatus={setCommentModalStatus}
          setCommentPostId={setCommentPostId}
          setDeletePostId={setDeletePostId}
          setDeleteModalStatus={setDeleteModalStatus}
          isSavePage={isSavePage}
        />
      ))}
      {imageModalStatus ? (
        <ImageModal
          setImageModalStatus={setImageModalStatus}
          modalImages={modalImages}
          modalStart={modalStart}
          setModalStart={setModalStart}
        />
      ) : null}
      {commentModalStatus ? (
        <CommentModal
          setCommentModalStatus={setCommentModalStatus}
          commentPostId={commentPostId}
        />
      ) : null}
      {deleteModalStatus ? (
        <DeletePostModal
          setDeleteModalStatus={setDeleteModalStatus}
          deletePostId={deletePostId}
          refreshData={refreshData}
        />
      ) : null}
    </section>
  );
};

export default PostContainer;
