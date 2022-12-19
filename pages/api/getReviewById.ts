import { Review } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getReviewByIdArgs } from "../../lib/actions/review";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getReviewByIdArgs = req.body;
  const { data } = body;
  try {
    const result: Review = await prisma.review.findFirstOrThrow({
      where: {
        id: data.id,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching review" });
  }
};
