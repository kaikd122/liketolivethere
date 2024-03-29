import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import generateUsername from "../lib/util/generate-username";
import { updateUserArgs, updateUserCommand } from "../lib/actions/user";
import uzeStore from "../lib/store/store";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";
import Modal from "./ui/Modal";
import ReviewCardModal from "./ReviewCardModal";
import Link from "next/link";
import PrizeModal from "./PrizeModal";

export interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const user = uzeStore((state) => state.user);
  const { setUser, setCurrentTab } = uzeStore((state) => state.actions);
  const { data: session } = useSession();
  const router = useRouter();
  const currentTab = uzeStore((state) => state.currentTab);
  useEffect(() => {
    console.log(session);
    if (!session || user?.name) {
      return;
    }
    if (session.user?.name) {
      setUser({
        ...user,
        email: session?.user?.email,
        id: session?.user?.id,
        name: session?.user?.name,
      });
      return;
    }

    if (!user?.name) {
      const newName = generateUsername();
      const args: updateUserArgs = {
        userId: session?.user?.id,
        data: { name: newName },
      };
      const updateUser = async () => {
        const res = await updateUserCommand(args);
        const data = await res.json();
        return data;
      };
      const data = updateUser();
      setUser({
        email: session?.user?.email,
        emailVerified: null,
        id: session?.user?.id,
        image: null,
        name: newName,
      });
      return;
    }
  }, [session?.user?.name]);

  useEffect(() => {
    if (currentTab !== undefined) {
      return;
    }

    if (router.asPath.slice(0, 6) === "/towns") {
      setCurrentTab("TOWNS");
    } else {
      setCurrentTab("MAP");
    }
  }, [router.asPath]);
  return (
    <div className=" flex flex-col w-full min-h-full ">
      <Toaster
        toastOptions={{
          style: { font: "Outfit" },
        }}
      />
      <Navbar />

      <ReviewCardModal />
      <PrizeModal />

      <main className="flex flex-col md:px-8 mb-8  md:gap-8 min-h-[70vh]">
        {children}
      </main>
      <footer className="flex flex-row gap-8 justify-center items-center h-12 border border-t border-stone-300 text-stone-700 border-r-0 border-l-0 border-b-0 mx-2">
        <p>Copyright © 2022 Like To Live There</p>
        <Link className="text-petal " href={"mailto:admin@liketolivethere.com"}>
          Contact
        </Link>
      </footer>
    </div>
  );
}
