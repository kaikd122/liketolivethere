//make an api endpoint to create a review
import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";
import { createReviewArgs } from "../../lib/actions/review";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: createReviewArgs = req.body;
  const { data } = body;
  console.log("HERE");
  try {
    console.log("I AM HERE");
    const nearestTown: Array<{ id: number; name: string; geom: string }> =
      await prisma.$queryRaw`SELECT id, name, geom::text FROM towns ORDER BY geom <-> st_setsrid(st_makepoint(${data.longitude},${data.latitude}),4326) LIMIT 1`;
    const result = await prisma.review.create({
      data: {
        ...data,
        townId: nearestTown[0].id,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while creating review" });
  }
};
