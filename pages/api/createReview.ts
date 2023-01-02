//make an api endpoint to create a review
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { createReviewArgs } from "../../lib/actions/review";
import cuid from "cuid";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: createReviewArgs = req.body;
  const { data } = body;
  const id = data?.id || cuid();
  try {
    const nearestTown: Array<{ id: number; name: string; geom: string }> =
      await prisma.$queryRaw`SELECT id, name, geom::text FROM towns ORDER BY geom <-> st_setsrid(st_makepoint(${data.longitude},${data.latitude}),4326) LIMIT 1`;
    const result =
      await prisma.$executeRaw`INSERT INTO "Review" (id, body, title, user_id, town_id, latitude, longitude, geom, updated_at, rating, last_lived_year) VALUES (${id}, ${data.body}, ${data.title}, ${data.userId}, ${nearestTown[0].id}, ${data.latitude}, ${data.longitude}, st_setsrid(st_makepoint(${data.longitude},${data.latitude}),4326), current_timestamp, ${data.rating}, ${data.lastLivedYear});`;

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while creating review" });
  }
};
