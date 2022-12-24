import { NextApiRequest, NextApiResponse } from "next";
import { getTownsByTextArgs } from "../../lib/actions/search";

export interface getTownsByTextResponse {
  id: number;
  name: string | null;
  postcode_sector: string | null;
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getTownsByTextArgs = req.body;
  const { data } = body;
  if (!data.text) return res.status(403).json({ err: "No text provided" });
  try {
    const result: Array<getTownsByTextResponse> = await prisma.towns.findMany({
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
      take: 20,
    });

    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while fetching nearby towns" });
  }
};
