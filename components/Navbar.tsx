import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import uzeStore from "../lib/store/store";
import AuthButton from "./AuthButton";
import Button from "./ui/Button";
import Tab from "./ui/Tab";

export default function Navbar() {
  const user = uzeStore((state) => state.user);
  const currentTab = uzeStore((state) => state.currentTab);
  const { setCurrentTab } = uzeStore((state) => state.actions);
  return (
    <div className="w-full flex flex-col">
      <div className="w-full flex flex-row flex-wrap items-center justify-between py-4 px-2 md:px-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow z-10">
        <button className="font-semibold text-3xl text-stone-50 active:scale-100 duration-75 hover:scale-105">
          <Link href={`/`}>LikeToLiveThere</Link>
        </button>

        <div className="flex gap-4 ">
          {user?.name && (
            <Button outlineColor="light" border="thick">
              <Link href={`/profile/${encodeURIComponent(user?.id)}`}>
                {user?.name}
              </Link>
            </Button>
          )}
          <AuthButton />
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap items-center gap-4 px-2 py-2 md:px-8">
        <Tab
          selected={currentTab === "MAP"}
          onClick={() => setCurrentTab("MAP")}
        >
          Search
        </Tab>
        <Tab
          selected={currentTab === "TOWNS"}
          onClick={() => setCurrentTab("TOWNS")}
        >
          Towns
        </Tab>
        <Tab
          selected={currentTab === "RANDOM"}
          onClick={() => setCurrentTab("RANDOM")}
        >
          Random review
        </Tab>
        <Tab
          selected={currentTab === "WRITE"}
          onClick={() => setCurrentTab("WRITE")}
        >
          Write review
        </Tab>
      </div>
    </div>
  );
}
