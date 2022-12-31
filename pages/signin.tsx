import { getCsrfToken, getSession } from "next-auth/react";
import Layout from "../components/Layout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

export default function SignIn({ csrfToken }) {
  return (
    <Layout>
      <div className="flex flex-col w-full justify-center items-center">
        <Card className="w-1/2">
          <form
            className="flex flex-col items-center justify-center gap-3"
            method="post"
            action="/api/auth/signin/email"
          >
            <span className="text-3xl">Sign in with your email address</span>
            <input name="csrfToken" type="hidden" defaultValue={csrfToken} />

            <input
              className="border rounded border-stone-400   outline-violet-300 p-2 shadow-sm"
              type="email"
              id="email"
              name="email"
            />

            <Button outlineColor="petal" border="thin" type="submit">
              Sign in
            </Button>
          </form>
        </Card>
      </div>
    </Layout>
  );
}

export async function getServerSideProps(context) {
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
