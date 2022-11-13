import { Review } from "@prisma/client";
import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
export default async (req: NextApiRequest, res: NextApiResponse) => {
    const data = req.body;
    console.log(data)
    try {
      const result = await prisma.review.create({
        data: {
          ...data,
        },
      });
      res.status(200).json(result);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: "Error occured while creating review" });
    }
  };