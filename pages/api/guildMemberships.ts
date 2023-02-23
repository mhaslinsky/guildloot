import { prisma } from "../../prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { getCookie } from "cookies-next";

export default async function getGuildMemberships(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const email = session.user!.email!;
  //return all guildmemberships for a user
  if (req.method == "GET") {
    try {
      await prisma.user
        .findUnique({
          where: { email: email },
          include: { guildAdmin: true, guildMember: true, guildOfficer: true },
        })
        .then((data) => {
          res.status(200).json(data);
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "error reading from DB" });
    }
  } else if (req.method == "POST") {
    const token = getCookie("next-auth.session-token", { req, res }) as string;
    try {
      const userSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: { user: true },
      });
      if (!userSession) return res.status(401).json({ message: "User not found" });
      const { guildID } = req.body;
      console.log(guildID);
      return res.status(200).json({ message: "success", guildID, userID: userSession.user.id });
    } catch (err) {
      console.warn(err);
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
