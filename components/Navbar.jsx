import Link from "next/link";
import React, { useRef, useEffect, useState } from "react";
import SearchBar from "./SearchBar";
import {
  BsHouse,
  BsHeart,
  BsPlusCircle,
  BsBookmark,
  BsPerson,
} from "react-icons/bs";
import { BiLogOut } from "react-icons/bi";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
export default function Navbar() {
  const { data: session } = useSession();
  const [dropDownStatus, setDropDownStatus] = useState(false);
  const profileRef = useRef();

  const router = useRouter();

  useEffect(() => {
    const event = document.addEventListener("click", (e) => {
      if (e.target !== profileRef.current) {
        setDropDownStatus(false);
      }
    });

    return () => document.removeEventListener("click", event);
  }, []);

  return (
    <header className="sticky top-0 z-40 flex items-center justify-between py-8 border-b bg-dark-100 ">
      <div className="flex items-baseline w-full gap-8 lg:w-max lg:justify-start md:justify-between">
        <Link href="/" className="text-2xl font-medium text-white">
          Chan
        </Link>
        <SearchBar />
      </div>
      <nav className="absolute items-center hidden gap-8 text-white -translate-x-1/2 lg:flex left-1/2">
        <CustomLink to="/">
          <BsHouse size={22} />
        </CustomLink>
        <CustomLink to="/create">
          <BsPlusCircle size={22} />
        </CustomLink>
        <CustomLink to={`/save?userid=${session?.user.id}`}>
          <BsBookmark size={22} />
        </CustomLink>
      </nav>
      <div
        className="items-center hidden gap-4 cursor-pointer lg:flex"
        ref={profileRef}
        onClick={() => setDropDownStatus(true)}
      >
        {session?.user?.image ? (
          <img
            src={session?.user?.image}
            alt={"profile"}
            className="w-8 h-8 rounded-full pointer-events-none "
          />
        ) : (
          <img
            src="/profile.png"
            className="w-8 h-8 rounded-full pointer-events-none "
          />
        )}

        {session?.user?.username || session?.user?.name ? (
          <span className="text-white pointer-events-none">
            {session?.user?.username || session?.user?.name}
          </span>
        ) : (
          <span className="w-[5rem] h-3 bg-gray-400 bg-opacity-25 block" />
        )}
      </div>
      {dropDownStatus ? (
        <div className="absolute right-0 top-20 rounded-lg bg-card max-w-[12rem] w-full bg-dark-25 p-4 z-50 space-y-2 hidden lg:block">
          <Link href={`/profile/${session?.user.id}`} className="block">
            <button className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-white bg-dark-50 hover:bg-dark-75 hover:text-primary">
              <BsPerson size={18} />
              Profile
            </button>
          </Link>
          <button
            className="flex items-center justify-center w-full gap-2 py-2 font-semibold text-red-600 bg-dark-50 hover:bg-dark-75"
            onClick={signOut}
          >
            <BiLogOut size={18} />
            Log out
          </button>
        </div>
      ) : null}
    </header>
  );
}

const CustomLink = ({ to, children }) => {
  const router = useRouter();

  const currentLink = router.pathname.split("?")[0] === to.split("?")[0];

  return (
    <Link href={to} className={`${currentLink ? "text-primary" : null}`}>
      {children}
      {currentLink ? (
        <div className="w-[6px] h-[6px] mx-auto mt-1 rounded-full bg-primary" />
      ) : (
        <div className="mt-1" />
      )}
    </Link>
  );
};
