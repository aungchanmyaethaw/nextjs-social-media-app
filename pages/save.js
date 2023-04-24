import { useRouter } from "next/router";
import { getServerSession } from "next-auth";
import React, { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { authOptions } from "./api/auth/[...nextauth]";
import prisma from "@/lib/prisma";
import { getAllSavePosts } from "@/lib/save";
import PostContainer from "@/components/PostContainer";
import { TbBookmarkOff } from "react-icons/tb";

export default function Save({ posts }) {
  const router = useRouter();
  const [filteredPosts, setfilteredPosts] = useState([]);

  const refreshData = () => {
    router.replace(router.asPath);
  };

  useEffect(() => {
    const filteredPosts = posts.map((post) => post.post);
    setfilteredPosts(filteredPosts);
  }, []);

  return (
    <Layout>
      <h2 className="sticky pt-4 text-3xl font-medium text-center text-white bg-dark-100">
        Saved
      </h2>
      {filteredPosts.length > 0 ? (
        <PostContainer
          posts={filteredPosts}
          refreshData={refreshData}
          isSavePage
        />
      ) : (
        <div className="flex flex-col items-center justify-center w-full gap-2 py-24">
          <TbBookmarkOff className="text-[80px] text-gray-400" />
          <h2 className="text-xl font-medium text-gray-400">
            Currently empty...
          </h2>
        </div>
      )}
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const { userid } = context.query;
  const session = await getServerSession(context.req, context.res, authOptions);
  let posts = await getAllSavePosts(prisma, userid);
  posts = JSON.parse(JSON.stringify(posts));
  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
      },
    };
  }

  return {
    props: { session, posts },
  };
}
