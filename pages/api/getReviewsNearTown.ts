import { NextApiRequest, NextApiResponse } from "next";
import { getReviewsNearTownArgs } from "../../lib/actions/review";
import { TOWN_REVIEWS_PAGE_SIZE } from "../../lib/constants";

export interface getReviewsNearTownResponse {
  id: string;
  title: string | null;
  body: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  user_id: string | null;
  createdAt: Date;
  distance: number;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getReviewsNearTownArgs = req.body;
  const { data } = body;
  try {
    const result: Array<getReviewsNearTownResponse> =
      await prisma.$queryRaw`WITH town_geom AS (SELECT geom FROM towns WHERE id = ${
        data.townId
      })  SELECT id, title, body, rating, latitude, longitude, user_id, ST_Distance(Geography(geom), Geography((SELECT geom from town_geom)), true) AS distance FROM "Review" WHERE 
        ST_DWithin(Geography(geom), Geography((SELECT geom FROM town_geom)), 2000) ORDER BY geom <-> (SELECT geom FROM town_geom) LIMIT ${
          data.limit || TOWN_REVIEWS_PAGE_SIZE
        } OFFSET ${data.offset}`;

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching nearby towns" });
  }
};
