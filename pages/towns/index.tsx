import { NextSeo } from "next-seo";
import React from "react";
import Layout from "../../components/Layout";
import TownsContainer from "../../containers/TownsContainer";

function Towns() {
  return (
    <Layout>
      <NextSeo
        description={`Browse towns | Like To Live There`}
        title={`Browse towns | Like To Live There`}
        openGraph={{
          title: `Browse towns | Like To Live There`,
          description: `Browse towns | Like To Live There`,
          url: `https://www.liketolivethere.com/towns/`,
        }}
      />
      <TownsContainer />
    </Layout>
  );
}

export default Towns;
