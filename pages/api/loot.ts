import { prisma } from "../../prisma/client";
import createRCLootItemRecord from "../../utils/functions/writeRCLootItemToDB";
import type { RCLootItem } from "../../utils/types";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";

export default async function lootEndpoint(req: any, res: any) {
  if (req.method == "POST") {
    try {
      const guildID = req.body.currentGuild;
      const itemData = JSON.parse(req.body.rcLootData);
      if (Array.isArray(itemData)) {
        itemData.forEach(async (item) => {
          const { isAwardReason, date, time, ...itemData } = item;
          const dateTimeString = `${date} ${time}`;
          const dateTime = new Date(dateTimeString);
          const newItem: RCLootItem = {
            ...itemData,
            dateTime,
            guild: guildID,
            isAwardReason: isAwardReason === "true" ? true : false,
          };
          await createRCLootItemRecord(newItem);
        });
      } else {
        const singularItem = JSON.parse(req.body.rcLootData);
        const { isAwardReason, date, time, ...itemData } = singularItem;
        const dateTimeString = `${date} ${time}`;
        const dateTime = new Date(dateTimeString);
        const newItem: RCLootItem = {
          ...itemData,
          dateTime,
          guild: guildID,
          isAwardReason: isAwardReason === "true" ? true : false,
        };
        await createRCLootItemRecord(newItem);
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
      return res.status(401).json({ message: "Unauthorized" });
    }
    const guildID = req.body.currentGuild;
    try {
      await prisma.rcLootItem
        .findMany({
          include: {
            bLootDBItem: true,
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
