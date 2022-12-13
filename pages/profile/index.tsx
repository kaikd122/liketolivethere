import React from "react";
import Layout from "../../components/Layout";

export interface ProfileProps {
  children: React.ReactNode;
}

function Profile({ children }: ProfileProps) {
  return <Layout>{children}</Layout>;
}

export default Profile;
