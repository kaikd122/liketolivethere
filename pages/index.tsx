import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "../components/Layout";
import MapContainer from "../components/Map";
import ReviewCard from "../components/ReviewCard";
import ReviewForm from "../components/ReviewForm";
import ProfileContainer from "../containers/ProfileContainer";
import TownsContainer from "../containers/TownsContainer";
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
        <ReviewCard />
        <ProfileContainer />
        <TownsContainer />
      </Layout>
    </>
  );
}
