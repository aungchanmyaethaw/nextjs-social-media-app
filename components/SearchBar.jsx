import { useGetUsers } from "@/hooks/useUser";
import Link from "next/link";
import React, { useState } from "react";
import { BsSearch } from "react-icons/bs";

const SearchBar = () => {
  const [query, setQuery] = useState("");
  const { data, isLoading } = useGetUsers(query || "");

  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-dark-75 focus-within:border-primary w-[15rem] relative">
      <BsSearch className="text-primary text-bold shrink-0" size="18" />
      <input
        type="text"
        className="w-full text-white bg-transparent focus:outline-none placeholder:text-gray-400 caret-primary"
        placeholder="Explore..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {/* searchlist */}
      {isLoading ? (
        <h1>Loading</h1>
      ) : data.length > 0 ? (
        <ul className="absolute p-4 bg-dark-25 max-w-[320px] w-full rounded top-12 left-0 z-50 flex flex-col gap-2">
          {data.map((person) => (
            <Link
              href={`/profile/${person.id}`}
              className="group flex items-center gap-2 "
              key={person.id}
            >
              <img src={person.image} alt="" className="w-8 h-8 rounded-full" />
              <span className="group-hover:text-primary text-white whitespace-nowrap">
                {person.username || person.name}
              </span>
            </Link>
          ))}
        </ul>
      ) : query !== "" ? (
        <span className="absolute p-4 bg-dark-25 max-w-[320px] w-full rounded top-12 left-0 z-50 block text-white">
          no results for "{query}"
        </span>
      ) : null}
    </div>
  );
};

export default SearchBar;
