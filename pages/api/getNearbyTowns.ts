import { NextApiRequest, NextApiResponse } from "next";
import { getNearbyTownsArgs } from "../../lib/actions/search";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: getNearbyTownsArgs = req.body;
  const { data } = body;
  try {
    console.log("GET NEARBY TOWNS", data);
    const result: Array<{ id: number; name: string; geom: string }> =
      await prisma.$queryRaw`SELECT id, name, geom::text FROM towns ORDER BY geom <-> st_setsrid(st_makepoint(${data.longitude},${data.latitude}),4326) LIMIT ${data.limit}`;
    console.log("RES", result);
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    console.log("ERROR WHEN GETTING NEARBY");
    res.status(403).json({ err: "Error occured while fetching nearby towns" });
  }
};
