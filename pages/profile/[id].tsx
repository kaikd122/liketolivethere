import { User } from "@prisma/client";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import Layout from "../../components/Layout";
import {
  updateUserCommand,
  updateUserArgs,
  getUserRequest,
} from "../../lib/actions/user";
import uzeStore from "../../lib/store/store";
function ProfileId() {
  const { data: session } = useSession();
  const { setUser } = uzeStore((state) => state.actions);
  const user = uzeStore((state) => state.user);

  const [value, setValue] = useState("");

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault();
    const getRes = await getUserRequest({ name: value });
    if (getRes.ok) {
      const data: User[] = await getRes.json();
      if (data.length) {
        alert("username taken");
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
    } else {
      console.log("NOT OK");
    }
  }
  return (
    <Layout>
      <form>
        <input
          onChange={(e) => setValue(e.target.value)}
          value={value}
          defaultValue={session?.user?.name}
        />
        <button type="submit" onClick={(e) => handleSubmit(e)}>
          Change username
        </button>
      </form>
    </Layout>
  );
}

export default ProfileId;
