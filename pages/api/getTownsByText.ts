import { NextApiRequest, NextApiResponse } from "next";
import { getTownsByTextArgs } from "../../lib/actions/search";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getTownsByTextArgs = req.body;
  const { data } = body;
  try {
    const result: Array<{
      id: number;
      name: string | null;
      postcode_sector: string | null;
    }> = await prisma.towns.findMany({
      where: {
        OR: [
          {
            name: {
              contains: data.text,
              mode: "insensitive",
            },
          },
          {
            postcode_sector: {
              contains: data.text,
              mode: "insensitive",
            },
          },
        ],
      },
      select: {
        id: true,
        name: true,
        postcode_sector: true,
      },
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching nearby towns" });
  }
};
