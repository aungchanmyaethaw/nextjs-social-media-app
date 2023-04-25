import React, { useEffect, useState } from "react";
import { getServerSession } from "next-auth";
import { useRouter } from "next/router";
import { IoReturnDownBackOutline } from "react-icons/io5";
import { BsPencilSquare } from "react-icons/bs";
import Layout from "@/components/Layout";
import prisma from "@/lib/prisma";
import { authOptions } from "../api/auth/[...nextauth]";
import { getProfilePosts } from "@/lib/profile";
import PostContainer from "@/components/PostContainer";
import ProfileEditModal from "@/components/ProfileEditModal";

export default function Profile({ posts, session }) {
  const [profileModalStatus, setProfileModalStatus] = useState(false);

  const router = useRouter();

  const {
    user: { name, email, image, username },
  } = session;

  const refreshData = () => {
    router.replace(router.asPath);
  };

  const handleBack = () => {
    router.back();
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
    <main className="w-full h-full bg-dark-100">
      <div className="flex items-start justify-between max-w-6xl gap-4 p-4 mx-auto pt-[80px]">
        <aside className="sticky flex flex-col items-center gap-2 p-4 basis-1/3 top-[96px] bg-dark-25 rounded-lg">
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
          <button
            className="flex items-center gap-2 px-8 py-2 mx-auto font-semibold rounded bg-primary hover:bg-yellow-300"
            onClick={() => setProfileModalStatus(true)}
          >
            <BsPencilSquare />
            Edit
          </button>
        </aside>
        <div className="basis-2/3">
          <PostContainer posts={posts} refreshData={refreshData} />
        </div>
        {profileModalStatus ? (
          <ProfileEditModal
            setProfileModalStatus={setProfileModalStatus}
            refreshData={refreshData}
            session={session}
          />
        ) : null}
      </div>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  let posts = await getProfilePosts(prisma, session?.user?.id);
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
