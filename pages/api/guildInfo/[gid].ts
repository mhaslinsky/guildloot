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
  if (req.method == "GET") {
    const { gid } = req.query;
    try {
      await prisma.guild
        .findUnique({
          where: { id: gid as string },
          include: {
            Admin: { select: { name: true, lastSignedIn: true, image: true, id: true } },
            officers: { select: { name: true, lastSignedIn: true, image: true, id: true } },
            members: { select: { name: true, lastSignedIn: true, image: true, id: true } },
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
    const userID = req.body.userID;
    try {
      const userSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: {
          user: {
            include: { guildAdmin: true, guildOfficer: true, accounts: true, sessions: true, guildMember: true },
          },
        },
      });
      const userToBeChanged = await prisma.user.findUnique({
        where: { id: userID },
        include: { guildAdmin: true, guildOfficer: true },
      });
      if (!userToBeChanged) return res.status(404).json({ message: "User not found" });
      if (!userSession) return res.status(401).json({ message: "Unauthorized" });
      const guildAdminships = userSession.user.guildAdmin || [];
      const adminofReqGuild = guildAdminships.find((guild: Guild) => guild.id === gid);
      const guildOfficerships = userSession.user.guildOfficer || [];
      const officerofReqGuild = guildOfficerships.find((guild: Guild) => guild.id === gid);
      if (role === "Admin" || role === "Officer") {
        if (!adminofReqGuild) {
          return res.status(401).json({ message: "Only admin's can transfer admin privs or promote officers" });
        }
        if (role === "Admin") {
          try {
            await prisma.guild.update({
              where: { id: gid as string },
              data: {
                adminId: userID,
                officers: { disconnect: { id: userID } },
                members: { disconnect: { id: userID } },
              },
            });
            await prisma.guild.update({
              where: { id: gid as string },
              data: { officers: { connect: { id: userSession.userId } } },
            });
          } catch (e) {
            console.log(e);
          }
        }
        if (role === "Officer") {
          await prisma.guild.update({
            where: { id: gid as string },
            data: { officers: { connect: { id: userID } }, members: { disconnect: { id: userID } } },
          });
        }
        return res.status(200).json({ message: `${role} set` });
      } else if (role === "Member") {
        if (!!adminofReqGuild) {
          await prisma.guild.update({
            where: { id: gid as string },
            data: { members: { connect: { id: userID } }, officers: { disconnect: { id: userID } } },
          });
          return res.status(200).json({ message: `${role} set` });
        }
        if (!!officerofReqGuild) {
          const admiOfficerCheck = [...userToBeChanged.guildAdmin, ...userToBeChanged.guildOfficer] || [];
          const isUserAdminOfficer = admiOfficerCheck.find((guild: Guild) => guild.id === gid);
          if (isUserAdminOfficer)
            return res.status(401).json({ message: "Only an administrator can demote an officer or themselves" });
          await prisma.guild.update({
            where: { id: gid as string },
            data: { members: { connect: { id: userID } }, officers: { disconnect: { id: userID } } },
          });
          return res.status(200).json({ message: `${role} set` });
        } else {
          return res.status(401).json({ message: "Only admin's or officer's can approve membership" });
        }
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "error updating DB" });
    }
  }
  if (!(req.method == "GET" || req.method == "POST")) {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
