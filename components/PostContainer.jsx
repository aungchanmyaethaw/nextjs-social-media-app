import React from "react";
import PostCard from "./PostCard";

const PostContainer = ({ posts }) => {
  return (
    <section className="flex flex-col items-center max-w-2xl gap-4 p-4 mx-auto mt-4 ">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </section>
  );
};

export default PostContainer;
