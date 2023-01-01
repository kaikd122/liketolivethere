import { getCsrfToken, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import MinimalLayout from "../components/MinimalLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

//@ts-ignore
export default function SignIn({ csrfToken }) {
  return (
    <MinimalLayout>
      <div className="flex flex-col w-full justify-center items-center p-10">
        <Card className="w-full md:w-3/4 ">
          <form
            className="flex flex-col items-center justify-center gap-5 pt-2"
            method="post"
            action="/api/auth/signin/email"
          >
            <span className="text-3xl">Sign in with your email address</span>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <input
              className="border rounded border-stone-400   outline-violet-300 p-2 shadow-sm w-full"
              type="email"
              id="email"
              name="email"
              placeholder="e.g. liketolive@there.com"
            />

            <Button outlineColor="petal" border="thin" type="submit">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </MinimalLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });
  const csrfToken = await getCsrfToken(context);

  if (session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      csrfToken: csrfToken,
    },
  };
}
