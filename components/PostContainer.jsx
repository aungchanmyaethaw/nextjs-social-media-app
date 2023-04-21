import React, { useEffect, useState } from "react";
import PostCard from "./PostCard";
import ImageModal from "./ImageModal";

const PostContainer = ({ posts }) => {
  const [imageModalStatus, setImageModalStatus] = useState(false);
  const [modalImages, setModalImages] = useState([]);
  const [modalStart, setModalStart] = useState(0);

  useEffect(() => {
    if (imageModalStatus) {
      document.body.style.maxHeight = "100vh";
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.maxHeight = "";
      document.body.style.overflowY = "";
    }
  }, [imageModalStatus]);

  return (
    <section className="flex flex-col items-center max-w-2xl gap-4 p-4 mx-auto mt-4">
      {posts.map((post) => (
        <PostCard
          key={post.id}
          post={post}
          setModalImages={setModalImages}
          setImageModalStatus={setImageModalStatus}
          setModalStart={setModalStart}
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
    </section>
  );
};

export default PostContainer;
