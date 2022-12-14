import { signIn, useSession, signOut } from "next-auth/react";
import React from "react";
import uzeStore from "../lib/store/store";
import Button from "./ui/Button";

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
        <Button outlineColor="light" onClick={handleLogout}>
          Log out
        </Button>
      ) : (
        <Button outlineColor="light" onClick={handleLogin}>
          Log in
        </Button>
      )}
    </>
  );
}

export default AuthButton;
