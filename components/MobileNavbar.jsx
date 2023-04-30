import React from "react";
import Link from "next/link";
import {
  BsHouse,
  BsHeart,
  BsPlusCircle,
  BsBookmark,
  BsPerson,
} from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";

import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { signOut } from "next-auth/react";

const MobileNavbar = () => {
  const { data: session } = useSession();

  const router = useRouter();

  const currentLink = router.pathname.split("/")[1] === "profile";

  return (
    <div className="w-full  text-white  h-[3.5rem] border-t fixed bottom-0 z-40 bg-dark-100 lg:hidden">
      <ul className="flex items-center h-full">
        <CustomLink to="/">
          <BsHouse size={20} />
        </CustomLink>
        <CustomLink to={`/save?userid=${session?.user.id}`}>
          <BsBookmark size={20} />
        </CustomLink>
        <CustomLink to="/create">
          <BsPlusCircle size={20} />
        </CustomLink>
        <div className="grid w-1/5 h-full place-items-center">
          <Link
            href={`/profile/${session?.user.id}`}
            className={` text-center    ${
              currentLink
                ? "text-primary bg-primary bg-opacity-10 w-full h-full flex flex-col justify-center items-center relative"
                : null
            }`}
          >
            {currentLink ? (
              <div className="absolute top-0 w-full h-1 bg-primary" />
            ) : null}

            <img
              src={session?.user?.image}
              alt={"profile"}
              className="w-6 h-6 rounded-full pointer-events-none "
            />
          </Link>
        </div>
        <button
          className="flex flex-col items-center justify-center w-1/5 h-full "
          onClick={signOut}
        >
          <BiLogOut size={20} />
        </button>
      </ul>
    </div>
  );
};

export default MobileNavbar;

const CustomLink = ({ to, children }) => {
  const router = useRouter();

  const currentLink = router.pathname.split("?")[0] === to.split("?")[0];

  return (
    <div className="grid w-1/5 h-full place-items-center">
      <Link
        href={to}
        className={` text-center    ${
          currentLink
            ? "text-primary bg-primary bg-opacity-10 w-full h-full flex flex-col justify-center items-center relative"
            : null
        }`}
      >
        {currentLink ? (
          <div className="absolute top-0 w-full h-1 bg-primary" />
        ) : null}
        {children}
      </Link>
    </div>
  );
};
