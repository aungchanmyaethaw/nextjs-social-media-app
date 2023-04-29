import React, { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { useRouter } from "next/router";

export default function Layout({ children }) {
  return (
    <main className="w-full min-h-screen pb-8 bg-dark-100 font-inter">
      <div className="mx-auto container max-w-[1440px] px-4  ">
        <Navbar />
        {children}
      </div>
    </main>
  );
}
