import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "../components/Layout";
import ReviewForm from "../components/ReviewForm";

export default function Home() {
  const MapboxMap = dynamic(() => import("../components/MapboxMap"), {
    ssr: false,
  });

  return (
    <>
      <Head>
        <title>LikeToLiveThere</title>
        <meta name="description" content="Placeholder" />
      </Head>
      <Layout>
        <MapboxMap />

        <ReviewForm />
      </Layout>
    </>
  );
}
