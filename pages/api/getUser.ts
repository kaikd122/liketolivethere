import { NextApiRequest, NextApiResponse } from "next";
import { useRouter } from "next/router";
import { getUserArgs } from "../../lib/actions/user";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const args: getUserArgs = {};
  const { name, userId } = req.query;
  args.name = name as string;
  args.userId = userId as string;

  if (!args?.name && !args?.userId) {
    res.status(403).json({ err: "No userId or name supplied to getUser" });
    return;
  }
  if (args?.name) {
    try {
      const users = await prisma.user.findMany({
        where: {
          name: args.name,
        },
      });
      res.status(200).json(users);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: "Error occured while fetching users" });
    }
  } else {
    try {
      const user = await prisma.user.findUnique({
        where: {
          id: args.userId,
        },
      });
      res.status(200).json(user);
    } catch (err) {
      console.log(err);
      res.status(403).json({ err: "Error occured while fetching user" });
    }
  }
};
