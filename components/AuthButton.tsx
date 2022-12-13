import { signIn, useSession, signOut } from "next-auth/react";
import React from "react";
import uzeStore from "../lib/store/store";

function AuthButton() {
  const isLoading = uzeStore((state) => state.isLoading);
  const { setIsLoading } = uzeStore((state) => state.actions);
  const { data: session } = useSession();

  function handleLogin() {
    setIsLoading(!isLoading);
    signIn(undefined, { callbackUrl: "/" });
  }
  function handleLogout() {
    setIsLoading(!isLoading);
    signOut();
  }

  return (
    <>
      {session ? (
        <button
          className="border border-stone-700 p-2 hover:bg-violet-100"
          onClick={handleLogout}
        >
          Log out
        </button>
      ) : (
        <button
          className="border border-stone-700 p-2 hover:bg-violet-100"
          onClick={handleLogin}
        >
          Log in
        </button>
      )}
    </>
  );
}

export default AuthButton;
