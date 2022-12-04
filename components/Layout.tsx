import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import { useCtx } from "../context/Context";
import { useSession } from "next-auth/react";
import { User } from "@prisma/client";
import generateUsername from "../lib/util/generate-username";
import {
  getUserRequest,
  updateUserArgs,
  updateUserCommand,
} from "../lib/actions/user";

export interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const ctx = useCtx();
  const { data: session } = useSession();
  useEffect(() => {
    console.log("SESH", session, "USER", ctx.user);
    console.log(18);
    if (!session || ctx.user?.name) {
      return;
    }
    if (session.user?.name) {
      console.log(26);
      const user: User = {
        ...ctx.user,
        email: session?.user?.email,
        id: session?.user?.id,
        name: session?.user?.name,
      };
      ctx.setUser(user);
      return;
    }

    if (!ctx.user?.name) {
      console.log(38);
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
      console.log(data);
      const user: User = {
        email: session?.user?.email,
        emailVerified: null,
        id: session?.user?.id,
        image: null,
        name: newName,
      };
      ctx.setUser(user);
      return;
    }
  }, [session?.user?.name]);
  return (
    <div className=" flex flex-col w-full ">
      <Navbar />
      <main className="flex flex-col p-10 gap-8">{children}</main>
      <button onClick={() => console.log("USER", ctx.user, "SESSION", session)}>
        CLICK
      </button>
    </div>
  );
}
