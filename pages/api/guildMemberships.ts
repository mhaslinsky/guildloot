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
          include: { guildAdmin: true, guildMember: true, guildOfficer: true, guildPending: true },
        })
        .then((data) => {
          res.status(200).json(data);
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "error reading from DB" });
    }
  } else if (req.method == "POST") {
    const token =
      (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
      (getCookie("next-auth.session-token", { req, res }) as string);
    try {
      const userSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: {
          user: {
            include: {
              guildAdmin: true,
              guildOfficer: true,
              accounts: true,
              guildMember: true,
              guildPending: true,
            },
          },
        },
      });
      if (!userSession) return res.status(401).json({ message: "Not logged in" });
      const { guildID } = req.body;
      if (!guildID) return res.status(400).json({ message: "No guildID provided" });
      const userGuildMemberships = userSession.user.guildAdmin.concat(
        userSession.user.guildOfficer,
        userSession.user.guildMember
      );
      const checkIfMember = userGuildMemberships.find((guild) => guild.id === guildID);
      if (checkIfMember) return res.status(400).json({ message: "Already a member of this guild" });
      const checkIfPending = userSession.user.guildPending.find((guild) => guild.id === guildID);
      if (checkIfPending) return res.status(400).json({ message: "Already have a request pending" });
      await prisma.guild.update({
        where: { id: guildID },
        data: { pending: { connect: { id: userSession.user.id } } },
      });
      return res.status(200).json({ message: "Request sent" });
    } catch (err) {
      console.warn(err);
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
