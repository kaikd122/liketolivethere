import { NextApiRequest, NextApiResponse } from "next";
import { getReviewsNearTownArgs } from "../../lib/actions/review";

export interface getReviewsNearTownResponse {
  id: number;
  title: string | null;
  body: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
  user_id: string | null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getReviewsNearTownArgs = req.body;
  const { data } = body;
  try {
    const result: Array<getReviewsNearTownResponse> =
      await prisma.$queryRaw`SELECT id, title, body, rating, latitude, longitude, user_id FROM "Review" WHERE 
        ST_DWithin(Geography(geom), Geography((SELECT geom FROM towns WHERE id = ${data.townId})), 2000)`;
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching nearby towns" });
  }
};
