import { signIn, useSession, signOut } from "next-auth/react";
import React from "react";
import { useCtx } from "../context/Context";

function AuthButton() {
  const { data: session } = useSession();

  function handleLogin() {
    ctx.setIsLoading(!ctx.isLoading);
    signIn(undefined, { callbackUrl: "/" });
  }
  function handleLogout() {
    ctx.setIsLoading(!ctx.isLoading);
    signOut();
  }

  const ctx = useCtx();
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
