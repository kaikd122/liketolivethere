import { signIn, useSession, signOut } from "next-auth/react";
import React from "react";
import uzeStore from "../lib/store/store";
import Button, { ButtonProps } from "./ui/Button";

function AuthButton({ outlineColor, border }: ButtonProps) {
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
        <Button
          outlineColor={outlineColor}
          border={border}
          onClick={handleLogout}
        >
          Log out
        </Button>
      ) : (
        <Button
          outlineColor={outlineColor}
          border={border}
          onClick={handleLogin}
        >
          Log in
        </Button>
      )}
    </>
  );
}

export default AuthButton;
