import prisma from "../../lib/prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { updateUserArgs } from "../../lib/actions/user";
export default async (req: NextApiRequest, res: NextApiResponse) => {
  const body: updateUserArgs = req.body;
  const { userId, data } = body;
  try {
    const result = await prisma.user.update({
      where: {
        id: userId,
      },
      data,
    });
    res.status(200).json(result);
  } catch (err) {
    console.log(err);
    res.status(403).json({ err: "Error occured while updating username" });
  }
};
