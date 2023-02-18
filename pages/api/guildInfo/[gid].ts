import { prisma } from "../../../prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getCookie } from "cookies-next";
import { Guild } from "@prisma/client";

export default async function guildMembers(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  const email = session.user!.email!;
  console.log(req.method);
  if (req.method == "GET") {
    const { gid } = req.query;
    try {
      await prisma.guild
        .findUnique({
          where: { id: gid as string },
          include: {
            Admin: { select: { name: true, lastSignedIn: true } },
            officers: { select: { name: true, lastSignedIn: true } },
            members: { select: { name: true, lastSignedIn: true } },
          },
        })
        .then((data) => {
          return res.status(200).json(data);
        });
    } catch (err) {
      console.log(err);
      return res.status(500).json({ message: "error reading from DB" });
    }
  }
  if (req.method == "POST") {
    if (!session) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    const token = getCookie("next-auth.session-token", { req, res }) as string;
    const { gid } = req.query;
    const role = req.body.role;
    try {
      const userSession: any | null = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: { user: { include: { guildAdmin: true, guildOfficer: true } } },
      });
      const guildAdminShips = userSession.user.guildAdmin || [];
      const checkGuildAdminShip = guildAdminShips.find((guild: Guild) => guild.id === gid);
      const guildOfficerShips = userSession.user.guildOfficer || [];
      const checkGuildOfficerShip = guildOfficerShips.find((guild: Guild) => guild.id === gid);
      if (role === "Admin" || role === "Officer") {
        if (!checkGuildAdminShip) {
          return res.status(401).json({ message: "Only admin's can transfer admin privs or promote officers" });
        }
        return res.status(200).json({ message: `${role} set` });
      } else if (role === "Member") {
        if (checkGuildAdminShip || checkGuildOfficerShip) {
          return res.status(200).json({ message: `${role} set` });
        }
        return res.status(401).json({ message: "Only admin's or officer's can approve membership" });
      }
    } catch (e) {
      console.log(e);
    }
    const user = req.body.user;
    console.log(gid, role, user);
  }
  if (!(req.method == "GET" || req.method == "POST")) {
    console.log("res 3");
    return res.status(405).json({ message: "Method not allowed" });
  }
}
