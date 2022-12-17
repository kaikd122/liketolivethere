import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "../components/Layout";
import MapContainer from "../components/Map";
import ReviewForm from "../components/ReviewForm";
import uzeStore from "../lib/store/store";

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
      </Layout>
    </>
  );
}
