import { ReactNode, useEffect } from "react";
import Navbar from "./Navbar";
import { useSession } from "next-auth/react";
import generateUsername from "../lib/util/generate-username";
import { updateUserArgs, updateUserCommand } from "../lib/actions/user";
import uzeStore from "../lib/store/store";

export interface LayoutProps {
  children: ReactNode;
}
export default function Layout({ children }: LayoutProps) {
  const user = uzeStore((state) => state.user);
  const { setUser } = uzeStore((state) => state.actions);
  const { data: session } = useSession();
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
  return (
    <div className=" flex flex-col w-full ">
      <Navbar />
      <main className="flex flex-col md:p-10 md:gap-8">{children}</main>
    </div>
  );
}
