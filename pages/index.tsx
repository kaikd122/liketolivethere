import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "../components/Layout";

export default function Home() {
  const Map = dynamic(() => import("../components/Map"), { ssr: false });

  return (
    <>
      <Head>
        <title>LikeToLiveThere</title>
        <meta name="description" content="Placeholder" />
      </Head>
      <Layout>
        <Map />
      </Layout>
    </>
  );
}
