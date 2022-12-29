import { Review } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const result: Review =
      await prisma.$queryRaw`SELECT id, title, rating, latitude, longitude, updated_at, created_at, town_id, user_id   FROM "Review" ORDER BY RANDOM() LIMIT 1`;
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching random review" });
  }
};
