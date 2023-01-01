import { getCsrfToken, getSession, signOut } from "next-auth/react";
import Layout from "../components/Layout";
import MinimalLayout from "../components/MinimalLayout";
import Button from "../components/ui/Button";
import Card from "../components/ui/Card";

//@ts-ignore
export default function SignOut() {
  return (
    <MinimalLayout>
      <div className="flex flex-col w-full justify-center items-center p-10">
        <Card className="w-full md:w-3/4 flex flex-col gap-4">
          <span className="text-3xl">Click here to complete signing out</span>

          <Button outlineColor="petal" border="thin" onClick={() => signOut()}>
            Sign out
          </Button>
        </Card>
      </div>
    </MinimalLayout>
  );
}

export async function getServerSideProps(context: any) {
  const { req } = context;
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: { destination: "/" },
    };
  }

  return {
    props: {
      session: session,
    },
  };
}
