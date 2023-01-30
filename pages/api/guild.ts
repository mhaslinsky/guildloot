import { prisma } from "../../prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import getServerSession from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";

export default async function guildEndpoint(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  console.log(session);

  if (req.method == "GET") {
    try {
      const userId = session.user.id;
      await prisma.user.findUnique({ where: { id: userId } }).then((data) => {
        res.status(200).json(data);
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "error reading from DB" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
