import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import uzeStore from "../lib/store/store";
import AuthButton from "./AuthButton";
import Button from "./ui/Button";

export default function Navbar() {
  const user = uzeStore((state) => state.user);
  return (
    <div className="w-full grid grid-cols-3 items-center justify-between py-4 px-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow-lg">
      <div />
      <div className=" flex justify-center ">
        <button className="font-semibold text-3xl text-stone-50 active:scale-100 duration-75 hover:scale-105">
          <Link href={`/`}>LikeToLiveThere</Link>
        </button>
      </div>
      <div className="flex gap-4 justify-end">
        {user?.name && (
          <Button outlineColor="light" borderThickness="thick">
            <Link href={`/profile/${encodeURIComponent(user?.id)}`}>
              {user?.name}
            </Link>
          </Button>
        )}
        <AuthButton />
      </div>
    </div>
  );
}
