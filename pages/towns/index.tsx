import { NextSeo } from "next-seo";
import React from "react";
import Layout from "../../components/Layout";
import TownsContainer from "../../containers/TownsContainer";

function Towns() {
  return (
    <Layout>
      <NextSeo
        description={`Browse towns | LikeToLiveThere`}
        title={`Browse towns | LikeToLiveThere`}
        openGraph={{
          title: `Browse towns | LikeToLiveThere`,
          description: `Browse towns | LikeToLiveThere`,
          url: `https://www.liketolivethere.com/towns/`,
        }}
      />
      <TownsContainer />
    </Layout>
  );
}

export default Towns;
