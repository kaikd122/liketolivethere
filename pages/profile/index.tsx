import React, { useEffect } from "react";
import Layout from "../../components/Layout";
import uzeStore from "../../lib/store/store";

export interface ProfileProps {
  children: React.ReactNode;
}

function Profile({ children }: ProfileProps) {
  return <Layout>{children}</Layout>;
}

export default Profile;
