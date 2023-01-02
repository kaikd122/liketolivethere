import React from "react";
import Image from "next/image";
import Link from "next/link";
import uzeStore from "../lib/store/store";

function MinimalLayout({ children }: { children: React.ReactNode }) {
  const { setCurrentTab } = uzeStore((state) => state.actions);
  return (
    <div className=" flex flex-col w-full min-h-full ">
      <div className="w-full flex flex-col">
        <div className="w-full gap-2 flex flex-row flex-wrap items-center justify-between py-4 px-2 md:px-8 bg-gradient-to-br from-violet-500 to-fuchsia-600 shadow z-10">
          <div className="flex flex-col gap-1 flex-wrap items-start">
            <button
              onClick={() => {
                setCurrentTab("MAP");
              }}
              className="font-semibold  text-4xl text-stone-50 active:scale-100 duration-75 hover:scale-105 font-display "
            >
              <Link href="/">
                <Image
                  alt="Like To Live There"
                  src={"/logo-truebw.png"}
                  width={350}
                  height={50}
                />
              </Link>
            </button>
          </div>
        </div>
      </div>
      <main className="flex flex-col md:px-8 mb-8  md:gap-8 min-h-[70vh]">
        {children}
      </main>
      <footer className="flex justify-center items-center h-12 border border-t border-stone-300 text-stone-700 border-r-0 border-l-0 border-b-0 mx-2">
        <p>Copyright © 2022 Like To Live There</p>
      </footer>
    </div>
  );
}

export default MinimalLayout;
