import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import Button from "../components/ui/Button";
import {
  getUserRequest,
  updateUserArgs,
  updateUserCommand,
} from "../lib/actions/user";
import uzeStore from "../lib/store/store";

function ProfileContainer() {
  const currentTab = uzeStore((state) => state.currentTab);
  const { data: session } = useSession();
  const { setUser, setIsMapLoaded } = uzeStore((state) => state.actions);
  const user = uzeStore((state) => state.user);
  const [isEditingUsername, setIsEditingUsername] = useState(false);

  const [value, setValue] = useState(user?.name || "");

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    if (!value) {
      toast.error("Username cannot be empty");
      return;
    }
    const getRes = await getUserRequest({ name: value });
    if (getRes.ok) {
      const data: User[] = await getRes.json();
      if (data.length) {
        toast.error("Username already taken");
        return;
      }
    } else {
      return;
    }

    const args: updateUserArgs = {
      userId: session?.user?.id,
      data: { name: value },
    };
    const updateRes = await updateUserCommand(args);
    if (updateRes.ok) {
      setUser({ ...user, name: value });
      setIsEditingUsername(false);
      toast.success("Username updated!");
    }
  }

  useEffect(() => {
    if (user?.name) {
      setValue(user.name);
    }
  }, [user]);

  if (currentTab !== "PROFILE") {
    return null;
  }

  return (
    <div className="w-full flex flex-col gap-4">
      <form className="flex flex-col gap-4">
        {isEditingUsername ? (
          <div className="flex flex-row items-center justify-start">
            <input
              onChange={(e) => setValue(e.target.value)}
              value={value}
              className="text-5xl border-stone-400 border rounded p-2 shadow-sm  outline-violet-300 "
            />
          </div>
        ) : (
          <h1 className="text-5xl">{user?.name}</h1>
        )}
        <div className="flex flex-row w-full justify-start items-center gap-3 ">
          {isEditingUsername && (
            <Button
              type="submit"
              outlineColor="stone"
              border="thin"
              onClick={(e) => handleSubmit(e!)}
            >
              Save
            </Button>
          )}
          <Button
            outlineColor="stone"
            border="thin"
            type="button"
            onClick={() => setIsEditingUsername(!isEditingUsername)}
          >
            {isEditingUsername ? "Cancel" : "Edit username"}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default ProfileContainer;
