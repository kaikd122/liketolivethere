import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import generateUsername from "../lib/util/generate-username";
import { updateUserArgs, updateUserCommand } from "../lib/actions/user";
import uzeStore from "../lib/store/store";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import { Toaster } from "react-hot-toast";

export interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const user = uzeStore((state) => state.user);
  const { setUser, setCurrentTab } = uzeStore((state) => state.actions);
  const { data: session } = useSession();
  const router = useRouter();
  console.log(router.asPath);
  useEffect(() => {
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
    console.log(router.asPath);
    if (router.asPath === "/") {
      setCurrentTab("MAP");
    } else if (router.asPath === "/profile") {
      setCurrentTab("PROFILE");
    } else if (router.asPath === "/towns") {
      setCurrentTab("TOWNS");
    }
  }, [router.asPath]);
  return (
    <div className=" flex flex-col w-full ">
      <Toaster
        toastOptions={{
          style: { font: "Outfit" },
        }}
      />
      <Navbar />

      <main className="flex flex-col md:px-8 mb-8  md:gap-8">{children}</main>
    </div>
  );
}
