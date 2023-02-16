import { prisma } from "../../../prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";

export default async function guildMembers(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const email = session.user!.email!;
  if (req.method == "GET") {
    const { gid } = req.query;
    try {
      await prisma.guild
        .findUnique({
          where: { id: gid as string },
          include: { Admin: true, officers: true, members: true },
        })
        .then((data) => {
          res.status(200).json(data);
        });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "error reading from DB" });
    }
  }
  if (req.method == "POST") {
    const { gid } = req.query;
    res.status(200).json({ message: `Got here succesfully` });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
