import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { createReviewArgs } from "../../lib/actions/review";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: createReviewArgs = req.body;
  const { data } = body;

  if (!data.id) {
    res.status(403).json({ err: "No id provided" });
    return;
  }
  const id = data.id;
  try {
    const nearestTown: Array<{ id: number; name: string; geom: string }> =
      await prisma.$queryRaw`SELECT id, name, geom::text FROM towns ORDER BY geom <-> st_setsrid(st_makepoint(${data.longitude},${data.latitude}),4326) LIMIT 1`;
    const result =
      await prisma.$executeRaw`UPDATE "Review" SET id = ${id}, body = ${data.body}, title = ${data.title}, user_id = ${data.userId}, town_id = ${nearestTown[0].id}, latitude = ${data.latitude}, longitude = ${data.longitude}, geom = st_setsrid(st_makepoint(${data.longitude},${data.latitude}),4326), updated_at = current_timestamp, rating = ${data.rating} WHERE id = ${id};`;

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while updating review" });
  }
};
