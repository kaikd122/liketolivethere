import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const { userId } = req.body;
  try {
    const res1 = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        name: "DELETED",
        email: `DELETED@${userId}.com`,
      },
    });

    const res2 = await prisma.review.deleteMany({
      where: {
        userId,
      },
    });

    const result = { user: res1, reviews: res2 };

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res
      .status(403)
      .json({ err: "Error occured while deleting user and reviews" });
  }
};
