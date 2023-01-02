import { useSession } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import uzeStore from "../lib/store/store";
import { replaceUrl } from "../lib/util/urls";
import AuthButton from "./AuthButton";
import Button from "./ui/Button";
import Tab from "./ui/Tab";
import Image from "next/image";

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
      <div className="w-full flex flex-row flex-wrap items-center justify-evenly text-sm text-black px-2 py-3 md:px-8 gap-2 bg-gradient-to-br from-[#ffab2d] to-[#feca48]  shadow-none z-50 ">
        <p>Write a review for a chance to win a £20 Amazon voucher</p>
        <Button className="shadow-none border-black border text-sm">
          Learn more
        </Button>
      </div>
      <div className="w-full gap-2 flex flex-row flex-wrap items-center justify-between py-4 px-2 md:px-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow z-10 ">
        <div className="flex flex-col gap-1 flex-wrap items-start">
          <button
            onClick={() => {
              setCurrentTab("MAP");
            }}
            className="font-semibold  text-4xl text-stone-50 active:scale-100 duration-75 hover:scale-105 font-display px-2"
          >
            {isMapLoaded ? (
              <Image
                alt="LikeToLiveThere"
                src={"/logo-truebw.png"}
                width={350}
                height={50}
              />
            ) : (
              <Link href="/">
                <Image
                  alt="Like To Live There"
                  src={"/logo-truebw.png"}
                  width={350}
                  height={50}
                />
              </Link>
            )}
          </button>

          <span className=" text-stone-50 text-sm">
            An open look into the world&apos;s neighbourhoods
          </span>
        </div>

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
          <AuthButton outlineColor="light" border="thick" />
        </div>
      </div>
      <div className="w-full flex flex-row flex-wrap items-center gap-3 md:gap-6 px-2 py-2 md:px-8 md:py-4">
        <Tab
          selected={currentTab === "MAP"}
          onClick={() => {
            setCurrentTab("MAP");
          }}
        >
          {isMapLoaded ? (
            <h1>Explore map</h1>
          ) : (
            <h1>
              <Link href="/">Explore map</Link>
            </h1>
          )}
        </Tab>

        <Tab
          selected={currentTab === "TOWNS"}
          onClick={() => {
            setCurrentTab("TOWNS");
          }}
        >
          <h2>Browse towns</h2>
        </Tab>
      </div>
    </div>
  );
}
