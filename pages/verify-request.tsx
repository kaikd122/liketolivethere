import React from "react";
import Layout from "../components/Layout";
import Card from "../components/ui/Card";

function VerifyRequest() {
  return (
    <Layout>
      <div className="flex flex-col w-full justify-center items-center">
        <Card className="w-full md:w-3/4 ">
          <div className="flex flex-col w-full justify-center items-center gap-3 pt-2">
            <span className="text-3xl">Check your email</span>
            <span>We've sent you an email with a magic link to sign in.</span>
          </div>
        </Card>
      </div>
    </Layout>
  );
}

export default VerifyRequest;
