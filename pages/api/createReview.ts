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
    const nearestTowns =
      await prisma.$queryRaw`SELECT id, name, geom::text FROM uk_towns ORDER BY geom <-> st_setsrid(st_makepoint(${data.longitude},${data.latitude}),4326) LIMIT 5`;

    console.log(nearestTowns);

    // const result = await prisma.review.create({
    //   data,
    // });
    // res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while creating review" });
  }
};
