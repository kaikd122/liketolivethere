import dynamic from "next/dynamic";
import Head from "next/head";
import Layout from "../components/Layout";
import MapContainer from "../components/Map";
import ReviewCardModal from "../components/ReviewCardModal";
import ReviewForm from "../components/ReviewForm";
import TownReviewsList from "../components/TownReviewsList";
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
        <ProfileContainer />
        <TownsContainer />
      </Layout>
    </>
  );
}
