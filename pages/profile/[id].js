import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { BsPencilSquare, BsFillFileEarmarkPostFill } from "react-icons/bs";
import prisma from "@/lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";
import {
  getOtherProfilePosts,
  getProfilePosts,
  getUserData,
} from "@/lib/profile";
import PostContainer from "@/components/PostContainer";
import ProfileEditModal from "@/components/ProfileEditModal";
import Link from "next/link";
import MobileNavbar from "@/components/MobileNavbar";

export default function Profile({ posts, session, user }) {
  const [profileModalStatus, setProfileModalStatus] = useState(false);

  const router = useRouter();

  const { id, name, email, image, username } = user;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleBack = () => {
    router.push("/");
  };

  useEffect(() => {
    if (profileModalStatus) {
      document.body.style.maxHeight = "100vh";
      document.body.style.overflowY = "hidden";
    } else {
      document.body.style.maxHeight = "";
      document.body.style.overflowY = "";
    }
  }, [profileModalStatus]);

  return (
    <main className="w-full h-full min-h-screen pb-20 bg-dark-100">
      <div className="flex flex-col md:flex-row items-center md:items-start justify-between max-w-6xl gap-4 p-4 mx-auto pt-[40px]">
        <aside className="md:sticky flex flex-col items-center gap-2 p-4 basis-1/3 top-[96px] bg-dark-25 rounded-lg">
          <button
            className="flex items-center self-start gap-2 mb-4 text-xl font-bold text-white hover:text-primary"
            onClick={handleBack}
          >
            <IoReturnDownBackOutline size={32} />
            Back
          </button>
          <img
            src={image}
            className="object-cover w-[96px] h-[96px] mb-2 overflow-hidden rounded-full"
          />

          <h2 className="text-xl font-medium text-white">{username || name}</h2>
          <span className="block mb-2 text-gray-400">{email}</span>
          {session?.user?.id === id ? (
            <button
              className="flex items-center gap-2 px-8 py-2 mx-auto font-semibold rounded bg-primary hover:bg-yellow-300"
              onClick={() => setProfileModalStatus(true)}
            >
              <BsPencilSquare />
              Edit
            </button>
          ) : null}
        </aside>
        <div className="basis-2/3">
          {posts.length > 0 ? (
            <PostContainer posts={posts} refreshData={refreshData} />
          ) : (
            <div className="flex flex-col items-center justify-center w-full gap-2 py-24">
              <BsFillFileEarmarkPostFill className="text-[80px] text-gray-400" />
              <h2 className="text-xl font-medium text-gray-400">
                Currently empty...
              </h2>
              {session?.user?.id === id ? (
                <Link
                  href="/create"
                  className="text-lg font-medium text-white underline hover:text-primary"
                >
                  Create your first post
                </Link>
              ) : null}
            </div>
          )}
        </div>
        {profileModalStatus ? (
          <ProfileEditModal
            setProfileModalStatus={setProfileModalStatus}
            refreshData={refreshData}
            session={session}
          />
        ) : null}
        <MobileNavbar />
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const { id: userId } = context.query;
  let posts;
  let user;
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin",
      },
    };
  }

  if (userId === session.user.id) {
    posts = await getProfilePosts(prisma, session?.user?.id);
    posts = JSON.parse(JSON.stringify(posts));
  } else {
    posts = await getOtherProfilePosts(prisma, userId);
    posts = JSON.parse(JSON.stringify(posts));
  }
  let tempuser = await getUserData(prisma, userId);
  tempuser = JSON.parse(JSON.stringify(tempuser));

  const { id, name, username, image, email } = tempuser;
  user = { id, name, username, image, email };

  return {
    props: { session, posts, user },
  };
}
