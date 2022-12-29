import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import uzeStore from "../lib/store/store";
import { replaceUrl } from "../lib/util/urls";
import AuthButton from "./AuthButton";
import Button from "./ui/Button";
import Tab from "./ui/Tab";

export default function Navbar() {
  const user = uzeStore((state) => state.user);
  const currentTab = uzeStore((state) => state.currentTab);
  const isMapLoaded = uzeStore((state) => state.isMapLoaded);
  const { setCurrentTab, setIsCreatingReview } = uzeStore(
    (state) => state.actions
  );
  const router = useRouter();
  return (
    <div className="w-full flex flex-col">
      <div className="w-full gap-2 flex flex-row flex-wrap items-center justify-between py-4 px-2 md:px-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow z-10">
        <button
          onClick={() => {
            setCurrentTab("MAP");
          }}
          className="font-semibold  text-3xl text-stone-50 active:scale-100 duration-75 hover:scale-105"
        >
          {isMapLoaded ? (
            "LikeToLiveThere"
          ) : (
            <Link href="/">LikeToLiveThere</Link>
          )}
        </button>

        <div className="flex gap-4 ">
          {user?.name && (
            <Button
              outlineColor="light"
              border="thick"
              onClick={() => setCurrentTab("PROFILE")}
            >
              {user.name}
            </Button>
          )}
          <AuthButton />
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap items-center gap-3 md:gap-6 px-2 py-2 md:px-8 md:py-4">
        <Tab
          selected={currentTab === "MAP"}
          onClick={() => {
            setCurrentTab("MAP");
          }}
        >
          {isMapLoaded ? "Explore map" : <Link href="/">Explore map</Link>}
        </Tab>

        <Tab
          selected={currentTab === "TOWNS"}
          onClick={() => {
            setCurrentTab("TOWNS");
          }}
        >
          Browse towns
        </Tab>
      </div>
    </div>
  );
}
