import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Layout from "@/components/Layout";
import prisma from "@/lib/prisma";
import { getPosts } from "@/lib/getServerData";
import PostContainer from "@/components/PostContainer";
export default function Root({ posts }) {
  return (
    <>
      <Layout>
        <PostContainer posts={posts} />
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let posts = await getPosts(prisma);
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
