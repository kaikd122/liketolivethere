import { NextApiRequest, NextApiResponse } from "next";

import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.body;
  try {
    const result = await prisma.review.findMany({
      where: {
        userId,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occured while getting reviews for user" });
  }
};
