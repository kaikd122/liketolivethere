import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import uzeStore from "../lib/store/store";
import AuthButton from "./AuthButton";

export default function Navbar() {
  const user = uzeStore((state) => state.user);
  return (
    <div className="w-full grid grid-cols-3 items-center justify-between py-4 px-8 border-b border-stone-700">
      <div />
      <div className=" flex justify-center ">
        <button className="font-medium text-2xl">
          <Link href={`/`}>LikeToLiveThere</Link>
        </button>
      </div>
      <div className="flex gap-4 justify-end">
        {user?.name && (
          <button className="border border-stone-700 p-2 hover:bg-violet-100">
            <Link href={`/profile/${encodeURIComponent(user?.id)}`}>
              {user?.name}
            </Link>
          </button>
        )}
        <AuthButton />
      </div>
    </div>
  );
}
