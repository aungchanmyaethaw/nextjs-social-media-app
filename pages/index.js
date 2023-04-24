import { getServerSession } from "next-auth";
import { authOptions } from "../pages/api/auth/[...nextauth]";
import Layout from "@/components/Layout";
import prisma from "@/lib/prisma";
import { getPosts } from "@/lib/post";
import PostContainer from "@/components/PostContainer";
import { useRouter } from "next/router";
export default function Root({ posts }) {
  const router = useRouter();

  const refreshData = () => {
    router.replace(router.asPath);
  };

  return (
    <>
      <Layout>
        <PostContainer posts={posts} refreshData={refreshData} />
      </Layout>
    </>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let posts = await getPosts(prisma, session?.user.id);
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
