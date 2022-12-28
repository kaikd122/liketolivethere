import { towns } from "@prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getTownByIdArgs } from "../../lib/actions/search";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getTownByIdArgs = req.body;
  const { data } = body;
  try {
    const result: Partial<towns> | null = await prisma.towns.findUnique({
      where: {
        id: data.id,
      },
      select: {
        id: true,
        name: true,
        latitude: true,
        longitude: true,
      },
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching town" });
  }
};
