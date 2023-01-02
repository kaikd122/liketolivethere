import { useRouter } from "next/router";
import React from "react";
import Layout from "../components/Layout";
import uzeStore from "../lib/store/store";

function Admin() {
  const user = uzeStore((state) => state.user);

  if (user?.id !== "admin") {
    return (
      <Layout>
        <div className="text-red-500 text-3xl p-2">Not authorized</div>
      </Layout>
    );
    //redirect to index page
  }

  return (
    <Layout>
      <div className="text-emerald-500 text-3xl p-2">Hello Admin!</div>
    </Layout>
  );
}

export default Admin;
