import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../lib/prisma";

export default async (_: NextApiRequest, res: NextApiResponse) => {
  try {
    const towns = await prisma.towns.findMany({
      select: {
        id: true,
        name: true,
      },
    });
    res.status(200).json(towns);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching towns" });
  }
};
