import React from "react";
import Layout from "../components/Layout";
import MinimalLayout from "../components/MinimalLayout";
import Card from "../components/ui/Card";

function VerifyRequest() {
  return (
    <MinimalLayout>
      <div className="flex flex-col w-full justify-center items-center p-10">
        <Card className="w-full md:w-3/4 ">
          <div className="flex flex-col w-full justify-center items-center gap-3 pt-2">
            <span className="text-3xl">Check your email</span>
            <span>
              We&apos;ve sent you an email with a magic link to sign in.
            </span>
            <span className="text-sm text-left">
              Sometimes this email can take a few minutes to arrive - please be
              patient!
            </span>
          </div>
        </Card>
      </div>
    </MinimalLayout>
  );
}

export default VerifyRequest;
