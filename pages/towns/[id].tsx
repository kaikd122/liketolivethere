import { useRouter } from "next/router";
import React from "react";
import Layout from "../../components/Layout";
import TownReviewsList from "../../components/TownReviewsList";
import { getReviewsNearTownRequest } from "../../lib/actions/review";
import { TOWN_REVIEWS_PAGE_SIZE } from "../../lib/constants";
import uzeStore from "../../lib/store/store";
import { getTownIdFromSlug } from "../../lib/util/urls";
import { getReviewsNearTownResponse } from "../api/getReviewsNearTown";

export async function getServerSideProps({ query }) {
  console.log(getTownIdFromSlug(query.id));

  console.log(getTownIdFromSlug(query.id));
  const townId = getTownIdFromSlug(query.id);
  try {
    const result: Array<getReviewsNearTownResponse> =
      await prisma.$queryRaw`WITH town_geom AS (SELECT geom FROM towns WHERE id = ${townId})  SELECT id, title, body, rating, latitude, longitude, user_id, ST_Distance(Geography(geom), Geography((SELECT geom from town_geom)), true) AS distance FROM "Review" WHERE 
            ST_DWithin(Geography(geom), Geography((SELECT geom FROM town_geom)), ${3000}) ORDER BY geom <-> (SELECT geom FROM town_geom) LIMIT ${TOWN_REVIEWS_PAGE_SIZE}`;

    console.log(result);

    const townRes = await prisma.towns.findUnique({
      where: {
        id: townId!,
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
        postcode_sector: true,
        county: true,
      },
    });

    const nearbyRes: Array<{ id: number; name: string; geom: string }> =
      await prisma.$queryRaw`SELECT id, name, geom::text FROM towns ORDER BY geom <-> st_setsrid(st_makepoint(${
        townRes?.longitude
      },${townRes?.latitude}),4326) LIMIT ${6}`;

    return {
      props: {
        data: {
          reviews: JSON.parse(JSON.stringify(result)),
          townId: townId,
          town: JSON.parse(JSON.stringify(townRes)),
          nearbyTowns: JSON.parse(JSON.stringify(nearbyRes)),
        },
      },
    };
  } catch (err) {
    return {
      props: {
        data: null,
      },
    };
  }
}

function TownId({ data }) {
  const { setCurrentTownId } = uzeStore((state) => state.actions);
  console.log(data);

  if (!data) {
    return (
      <Layout>
        <div className="flex flex-row w-full justify-center items-center pt-10">
          <p className="text-rose-600 text-lg">Oops! Something went wrong</p>
        </div>
      </Layout>
    );
  }

  setCurrentTownId(data.townId);

  return (
    <Layout>
      <TownReviewsList
        serverSideReviews={data.reviews}
        serverSideNearbyTowns={data.nearbyTowns.filter(
          (t) => t.id !== data.townId
        )}
        serverSideTown={data.town}
        serverSideIsAllCurrentTownReviewsLoaded={
          data.reviews.length < TOWN_REVIEWS_PAGE_SIZE
        }
      />
    </Layout>
  );
}

export default TownId;