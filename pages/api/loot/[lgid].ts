import { prisma } from "../../../prisma/client";
import { getServerSession } from "next-auth";
import createRCLootItemRecord from "../../../utils/functions/writeRCLootItemToDB";
import { RCLootItem } from "../../../utils/types";
import { authOptions } from "../auth/[...nextauth]";
import { getCookie } from "cookies-next";

function formatItem(item: any, guildID: string) {
  const { isAwardReason, date, time, ...itemData } = item;
  const dateTimeString = `${date} ${time}`;
  const dateTime = new Date(dateTimeString);
  const newItem: RCLootItem = {
    ...itemData,
    dateTime,
    guild: guildID,
    isAwardReason: isAwardReason === "true" ? true : false,
  };
  return newItem;
}

export default async function lootEndpoint(req: any, res: any) {
  if (req.method == "POST") {
    try {
      const guildID = req.body.currentGuild;
      const itemData = JSON.parse(req.body.rcLootData);
      if (Array.isArray(itemData)) {
        if (itemData.length === 0) return res.status(400).json({ message: `Enter Valid Loot` });
        itemData.forEach(async (item) => {
          const formattedItem = formatItem(item, guildID);
          await createRCLootItemRecord(formattedItem);
        });
      } else {
        const singularItem = JSON.parse(req.body.rcLootData);
        const formattedItem = formatItem(singularItem, guildID);

        await createRCLootItemRecord(formattedItem);
      }
      res.status(200).json({ message: ` written to DB successfully` });
    } catch (err: unknown) {
      if (err instanceof SyntaxError) {
        res.status(400).json({ message: "Invalid JSON" });
      } else {
        console.log(err);
        res.status(500).json({ message: "Error Writing to DB" });
      }
    }
  } else if (req.method == "GET") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) {
      return res.status(401).json({ message: "Not logged in" });
    }
    const token =
      (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
      (getCookie("next-auth.session-token", { req, res }) as string);
    const { lgid } = req.query;
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
      await prisma.rcLootItem
        .findMany({
          include: {
            bLootDBItem: true,
          },
          where: {
            guild: { id: lgid },
          },
        })
        .then((data) => {
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
