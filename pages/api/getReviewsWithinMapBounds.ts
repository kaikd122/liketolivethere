import { NextApiRequest, NextApiResponse } from "next";
import { getReviewsWithinMapBoundsArgs } from "../../lib/actions/review";

export interface getReviewsWithinMapBoundsResponse {
  id: number;
  title: string | null;
  rating: number | null;
  latitude: number | null;
  longitude: number | null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getReviewsWithinMapBoundsArgs = req.body;
  const { data } = body;
  try {
    const result: Array<getReviewsWithinMapBoundsResponse> =
      await prisma.$queryRaw`SELECT id, title, rating, latitude, longitude, geom::text FROM "Review" WHERE 
            ST_Contains(ST_MakeEnvelope(${data.bounds.sw.lng}, ${
        data.bounds.sw.lat
      }, ${data.bounds.ne.lng}, ${data.bounds.ne.lat}, 4326), geom)
            ORDER BY geom <-> st_setsrid(st_makepoint(${data.coordinates.lng},${
        data.coordinates.lat
      }),4326) LIMIT ${data.limit || 1000} OFFSET ${data.offset}`;
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occured while fetching reviews within map bounds" });
  }
};
