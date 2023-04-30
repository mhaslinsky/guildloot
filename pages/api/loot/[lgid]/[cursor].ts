import { getCookie } from "cookies-next";
import { prisma } from "../../../../prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]";

export default async function getLootEndpoint(req: any, res: any) {
  if (req.method == "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const token =
      (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
      (getCookie("next-auth.session-token", { req, res }) as string);

    const { lgid, cursor } = req.query;

    const skip = (cursor - 1) * 1200;

    try {
      const userSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: { user: { include: { guildAdmin: true, guildOfficer: true, guildMember: true } } },
      });

      if (!userSession) return res.status(401).json({ message: "User not found" });

      const guildMemberShips =
        userSession.user.guildAdmin.concat(userSession.user.guildOfficer, userSession.user.guildMember) || [];

      const checkGuildMemberShip = guildMemberShips.find((guild) => guild.id === lgid);
      if (!checkGuildMemberShip) {
        return res.status(401).json({ message: "You are not a member of that guild" });
      }
    } catch (e) {
      console.log("error occured getting user data: ", e);
      return res.status(500).json({ message: "An error occurred" });
    }
    try {
      console.log("querying loot");
      const allLoot = prisma.lootItem.findMany({
        where: {
          guild: { id: lgid },
        },
      });

      const lootChunk = await prisma.lootItem.findMany({
        skip,
        take: 1200,
        include: {
          bLootDBItem: true,
        },
        where: {
          guild: { id: lgid },
        },
      });

      const totalPages = Math.ceil((await allLoot).length / 1200);
      //updates the cursor to the next page, unless on last page, then returns undefined for useInfiniteQuery
      const nextPage = cursor == totalPages ? undefined : parseInt(cursor) + 1;

      const returnValue = { lootChunk, nextPage };
      return res.status(200).json(returnValue);
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: "error reading from DB" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
