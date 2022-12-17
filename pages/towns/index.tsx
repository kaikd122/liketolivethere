import React from "react";
import Layout from "../../components/Layout";

export interface TownsProps {
  children: React.ReactNode;
}

function Towns({ children }: TownsProps) {
  return <Layout>{children}</Layout>;
}

export default Towns;
