import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "../components/Layout";

import ReviewForm from "../components/ReviewForm";

import ProfileContainer from "../containers/ProfileContainer";
import TownsContainer from "../containers/TownsContainer";

export default function Home() {
  const MapContainer = dynamic(() => import("../components/Map"), {
    ssr: false,
  });
  return (
    <>
      <Head>
        <title>LikeToLiveThere</title>
        <meta name="description" content="Placeholder" />
      </Head>
      <Layout>
        <MapContainer />
        <ReviewForm />
        <ProfileContainer />
        <TownsContainer />
      </Layout>
    </>
  );
}
