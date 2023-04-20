import React from "react";
import { BsSearch } from "react-icons/bs";

const SearchBar = () => {
  return (
    <div className="flex items-center gap-4 px-4 py-2 rounded-full bg-dark-75 focus-within:border-primary w-[15rem]">
      <BsSearch className="text-primary text-bold shrink-0" size="18" />
      <input
        type="text"
        className="w-full text-white bg-transparent focus:outline-none placeholder:text-gray-400 caret-primary"
        placeholder="Explore..."
      />
    </div>
  );
};

export default SearchBar;
