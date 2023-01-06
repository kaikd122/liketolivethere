import {
  getCsrfToken,
  getSession,
  getProviders,
  signIn,
} from "next-auth/react";
import Layout from "../components/Layout";
import MinimalLayout from "../components/MinimalLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import Image from "next/image";
import { useRouter } from "next/router";

//@ts-ignore
export default function SignIn({ csrfToken, providers }) {
  const { error } = useRouter().query;
  const googleProvider = providers.google;
  return (
    <MinimalLayout>
      <div className="flex flex-col w-full justify-center items-center p-10">
        <Card className="w-full md:w-1/2 flex flex-col p-4 gap-4">
          <span className="text-3xl w-full">Sign in</span>
          <div className="flex flex-row justify-start w-full">
            {error && <SignInError error={error} />}
          </div>

          {error !== "OAuthAccountNotLinked" && (
            <Button
              outlineColor="petal"
              border="thin"
              onClick={() => {
                signIn(googleProvider?.id);
              }}
              smallScale
              className="flex flex-row justify-center text-xl items-center gap-2 w-full text-blue-500 border-blue-500 mb-4"
            >
              <Image
                alt="google-logo"
                src="/google-logo-9808.png"
                width={20}
                height={20}
              />
              <p>Sign in with Google</p>
            </Button>
          )}

          <form
            className="flex flex-col items-center justify-center gap-2 w-full"
            method="post"
            action="/api/auth/signin/email"
          >
            {error !== "OAuthAccountNotLinked" && (
              <span className="text-base">
                Or sign in in with your email address
              </span>
            )}

            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <input
              className="border rounded border-stone-400   outline-violet-300 p-2 shadow-sm w-full"
              type="email"
              id="email"
              name="email"
              placeholder="e.g. liketolive@there.com"
            />

            <Button
              outlineColor="petal"
              border="thin"
              type="submit"
              className="w-full"
              smallScale
            >
              Sign in
            </Button>
          </form>
          {error !== "OAuthAccountNotLinked" && (
            <p className="text-sm text-left w-full pt-4">
              If this is your first time signing in, an account will be created
              for you with a random username. Your email address will never be
              made public or shared with anyone else. It will only be used for
              the purposes of signing in.
            </p>
          )}
        </Card>
      </div>
    </MinimalLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });
  const csrfToken = await getCsrfToken(context);
  const providers = await getProviders();

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      csrfToken: csrfToken,
      providers: providers,
    },
  };
}

const errors: any = {
  Signin: "Try signing with a different account.",
  OAuthSignin: "Try signing with a different account.",
  OAuthCallback: "Try signing with a different account.",
  OAuthCreateAccount: "Try signing with a different account.",
  EmailCreateAccount: "Try signing with a different account.",
  Callback: "Try signing with a different account.",
  OAuthAccountNotLinked:
    "Please sign in with your original sign in method (email address)",
  EmailSignin: "Check your email address.",
  CredentialsSignin:
    "Sign in failed. Check the details you provided are correct.",
  default: "Unable to sign in.",
};

const SignInError = ({ error }: { error: any }) => {
  const errorMessage = error && (errors[error] ?? errors.default);
  return <span className="text-red-500"> {errorMessage} </span>;
};
