import { prisma } from "../../../prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]";
import { getCookie } from "cookies-next";
import { Account, Guild, Prisma, Session, User } from "@prisma/client";

export type guildMemberInfo = Guild & {
  Admin: {
    id: string;
    name: string;
    image: string | null;
    lastSignedIn: Date | null;
  };
  officers: {
    id: string;
    name: string;
    image: string | null;
    lastSignedIn: Date | null;
  }[];
  members: {
    id: string;
    name: string;
    image: string | null;
    lastSignedIn: Date | null;
  }[];
  pending: {
    id: string;
    name: string;
    image: string | null;
    lastSignedIn: Date | null;
  }[];
};

//takes in a session object and guildID, returns if user is admin or officer of that guild
export function checkUserRoles(
  userSession: Session & {
    user: User & {
      guildAdmin: Guild[];
      guildOfficer: Guild[];
      guildMember: Guild[];
      accounts: Account[];
      sessions: Session[];
    };
  },
  guildId: string
) {
  const guildAdminships = userSession.user.guildAdmin || [];
  const adminofReqGuild = guildAdminships.find((guild: Guild) => guild.id === guildId);
  const guildOfficerships = userSession.user.guildOfficer || [];
  const officerofReqGuild = guildOfficerships.find((guild: Guild) => guild.id === guildId);

  return { adminofReqGuild, officerofReqGuild };
}

export default async function guildManagement(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  const token =
    (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
    (getCookie("next-auth.session-token", { req, res }) as string);
  if (!session) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  //endpoint for getting guild members/info
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
            pending: { select: { name: true, lastSignedIn: true, image: true, id: true } },
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
  //endpoint for updating guild members/info
  if (req.method == "POST") {
    const { gid } = req.query;
    //requested user and role change values
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

      if (!userSession) return res.status(401).json({ message: "Unauthorized" });

      const userToBeChanged = await prisma.user.findUnique({
        where: { id: userID },
        include: { guildAdmin: true, guildOfficer: true, guildMember: true },
      });

      if (!userToBeChanged) return res.status(404).json({ message: "User not found" });

      const { adminofReqGuild, officerofReqGuild } = checkUserRoles(userSession, gid as string);

      const adminCheck = [...userToBeChanged.guildAdmin] || [];
      const isUserAdmin = adminCheck.find((guild: Guild) => guild.id === gid);
      const officerCheck = [...userToBeChanged.guildOfficer] || [];
      const isUserOfficer = officerCheck.find((guild: Guild) => guild.id === gid);
      const memberCheck = [...userToBeChanged.guildMember] || [];
      const isUserMember = memberCheck.find((guild: Guild) => guild.id === gid);

      if (role === "Admin" || role === "Officer") {
        if (!adminofReqGuild) {
          return res.status(401).json({ message: "Only admin's can transfer admin privs or promote officers" });
        }
        if (role === "Admin") {
          if (isUserAdmin) return res.status(401).json({ message: "User is already administrator" });
          try {
            await prisma.guild.update({
              where: { id: gid as string },
              data: {
                adminId: userID,
                officers: { disconnect: { id: userID } },
                members: { disconnect: { id: userID } },
                pending: { disconnect: { id: userID } },
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
          if (isUserOfficer) return res.status(401).json({ message: "User is already an officer" });
          if (isUserAdmin)
            return res.status(401).json({ message: "Must promote a new admin, before demoting existing one" });
          await prisma.guild.update({
            where: { id: gid as string },
            data: {
              officers: { connect: { id: userID } },
              members: { disconnect: { id: userID } },
              pending: { disconnect: { id: userID } },
            },
          });
        }
        return res.status(200).json({ message: `${role} set` });
      } else if (role === "Member") {
        if (isUserMember) return res.status(401).json({ message: "User is already a member" });
        if (!!adminofReqGuild) {
          if (isUserAdmin)
            return res.status(401).json({ message: "Must promote a new admin, before demoting existing one" });
          await prisma.guild.update({
            where: { id: gid as string },
            data: {
              members: { connect: { id: userID } },
              officers: { disconnect: { id: userID } },
              pending: { disconnect: { id: userID } },
            },
          });
          return res.status(200).json({ message: `${role} set` });
        }
        if (!!officerofReqGuild) {
          if (isUserAdmin || isUserOfficer)
            return res.status(401).json({ message: "Only an administrator can demote an officer or themselves" });
          await prisma.guild.update({
            where: { id: gid as string },
            data: {
              members: { connect: { id: userID } },
              officers: { disconnect: { id: userID } },
              pending: { disconnect: { id: userID } },
            },
          });
          return res.status(200).json({ message: `${role} set` });
        } else {
          return res.status(401).json({ message: "Only admin's or officer's can approve membership" });
        }
      } else if (role === "Remove") {
        if (!(adminofReqGuild || officerofReqGuild))
          return res.status(401).json({ message: "Only admins or officers can remove users/reject applications" });
        if (officerofReqGuild && isUserOfficer)
          return res.status(401).json({ message: "Officers cannot remove fellow officers" });
        if (isUserAdmin) return res.status(401).json({ message: "Cannot remove an admin" });
        await prisma.guild.update({
          where: { id: gid as string },
          data: {
            officers: { disconnect: { id: userID } },
            members: { disconnect: { id: userID } },
            pending: { disconnect: { id: userID } },
          },
        });
        return res.status(200).json({ message: "User removed" });
      } else if (role === "Quit") {
        if (isUserAdmin)
          return res
            .status(401)
            .json({ message: "Cannot quit a guild as an admin, promote another member first" });
        if (!(isUserMember || isUserOfficer))
          return res.status(401).json({ message: "User is not a member of this guild" });
        await prisma.guild.update({
          where: { id: gid as string },
          data: {
            members: { disconnect: { id: userID } },
            officers: { disconnect: { id: userID } },
          },
        });
        return res.status(200).json({ message: "User removed" });
      } else {
        return res.status(401).json({ message: "Invalid role" });
      }
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "error updating DB" });
    }
  }
  //endpoint for deleting a guild
  if (req.method == "DELETE") {
    try {
      const userSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: {
          user: {
            include: { guildAdmin: true, guildOfficer: true, accounts: true, sessions: true, guildMember: true },
          },
        },
      });
      if (!userSession) return res.status(401).json({ message: "Unauthorized" });
      const { gid } = req.body;
      const guild = await prisma.guild.findUnique({ where: { id: gid as string } });
      if (!guild) return res.status(404).json({ message: "Guild not found" });
      const guildAdminships = userSession.user.guildAdmin || [];
      const adminofReqGuild = guildAdminships.find((guild: Guild) => guild.id === gid);
      if (!adminofReqGuild) return res.status(401).json({ message: "Only Admins can delete guilds" });
      await prisma.guild.delete({ where: { id: gid as string } });
    } catch (e) {
      console.log(e);
      return res.status(500).json({ message: "error updating DB" });
    }
    return res.status(200).json({ message: "Guild deleted" });
  }
  //endpoint for updating a guild(Server only currently)
  if (req.method == "PATCH") {
    try {
      const userSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: {
          user: {
            include: { guildAdmin: true, guildOfficer: true, accounts: true, sessions: true, guildMember: true },
          },
        },
      });
      if (!userSession) return res.status(401).json({ message: "Unauthorized" });

      const { server, currentGuildID } = req.body;

      const guild = await prisma.guild.findUnique({ where: { id: currentGuildID as string } });
      if (!guild) return res.status(404).json({ message: "Guild not found" });

      const { adminofReqGuild, officerofReqGuild } = checkUserRoles(userSession, currentGuildID as string);
      if (!(adminofReqGuild || officerofReqGuild))
        return res.status(401).json({ message: "Only Admins or Officers can change guild server" });

      await prisma.guild.update({
        where: { id: currentGuildID as string },
        data: { server },
      });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.code);
        if (e.code == "P2002") {
          return res.status(400).json({ message: "Guild name already exists on that server" });
        }
      }
      console.log("error on guild creation: " + e);
      return res.status(500).json({ message: "Error Editting Guild" });
    }
    return res.status(200).json({ message: "Guild Server Updated" });
  }
  if (!(req.method == "GET" || req.method == "POST" || req.method == "DELETE" || req.method == "PATCH")) {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
