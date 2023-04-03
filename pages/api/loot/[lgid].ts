import { prisma } from "../../../prisma/client";
import { getServerSession } from "next-auth";
import { createRCLootItemRecord, createGargulLootItemRecord } from "../../../utils/functions/writeRCLootItemToDB";
import { authOptions } from "../auth/[...nextauth]";
import { getCookie } from "cookies-next";
import Papa from "papaparse";
import Database from "wow-classic-items";

type PapaReturn = {
  dateTime: string;
  character: string;
  itemID: number;
  offspec: number;
  id: string;
};

const items = new Database.Items({ iconSrc: "wowhead" });
const zones = new Database.Zones({ iconSrc: "wowhead" });

function formatItem(item: any, guildID: string) {
  const { isAwardReason, date, time, ...itemData } = item;
  const dateTimeString = `${date} ${time}`;
  const dateTime = new Date(dateTimeString);
  const newItem = {
    ...itemData,
    dateTime,
    guild: guildID,
    isAwardReason: isAwardReason === "true" ? true : false,
  };
  return newItem;
}

async function processRCLootData(guildID: any, itemData: any, req: any, res: any) {
  if (Array.isArray(itemData)) {
    if (itemData.length === 0) return res.status(400).json({ message: `Enter Valid Loot` });

    const promises = itemData.map(async (item, index) => {
      const formattedItem = formatItem(item, guildID);
      try {
        await createRCLootItemRecord(formattedItem, req);
        console.log(`finished writing ${item.itemName} number ${index + 1} to db`);
      } catch (err) {
        console.error(`failed to write ${item.itemName} number ${index + 1} to db:`, err);
        return item;
      }
    });

    const badItems = (await Promise.all(promises)).filter(Boolean);
    console.log(badItems);

    if (badItems.length > 0) {
      if (badItems.length === itemData.length)
        return res.status(500).json({
          message: `Error writing to loot history for all ${itemData.length} items`,
        });
      return res.status(207).json({
        message: `Succeeded writing ${itemData.length - badItems.length} of ${itemData.length} items`,
        badItems,
        code: 207,
      });
    } else {
      return res.status(200).json({ message: `Written to Loot History Successfully` });
    }
  } else {
    const singularItem = JSON.parse(req.body.lootData);
    const formattedItem = formatItem(singularItem, guildID);

    try {
      await createRCLootItemRecord(formattedItem, req);
    } catch (err) {
      console.error(`failed to write ${singularItem.itemName} to db:`, err);
      return res.status(500).json({ message: `Error writing to loot history for ${singularItem.itemName}` });
    }

    return res.status(200).json({ message: `Written to Loot History Successfully` });
  }
}

async function processGargulLootData(guildID: any, itemData: any, req: any, res: any) {
  const parsedData = Papa.parse(itemData, { header: true, dynamicTyping: true }).data as PapaReturn[];
  const expandedData = parsedData.map((item) => {
    const { itemID, dateTime, character, offspec, id } = item;
    const itemData = items.find((item) => item.itemId == itemID);
    if (!itemData) {
      console.log(`Item ${itemID} not found in database`);
      return null;
    } else {
      let source;
      for (let i = 0; i < itemData.tooltip.length; i++) {
        console.log(itemData.tooltip[i].label);
        if (itemData.tooltip[i].label === "Dropped by:") {
          source = itemData.tooltip[i + 1].label.split(": ")[1];
          break;
        }
      }
      console.log(source);
      // return {
      //   gargulID: id,
      //   itemID,
      //   itemName: itemData.name || "Unknown",
      //   dateTime,
      //   character,
      //   offspec,
      // };
    }

    // return {
    //   ...rest,
    //   itemID,
    //   itemName: name,
    //   itemIcon: icon,
    //   itemQuality: quality,
    //   itemLevel,
    //   itemClass,
    //   itemSubclass: subclass,
    //   guild: guildID,
    // };
  });

  return res.status(404).json({ message: `Gargul Support NYI` });
}

export default async function lootEndpoint(req: any, res: any) {
  if (req.method == "POST") {
    try {
      const guildID = req.body.currentGuild;
      const addon = req.body.addon;

      if (addon === "RCLootCouncil") {
        const itemData = JSON.parse(req.body.lootData);
        processRCLootData(guildID, itemData, req, res);
      } else {
        const itemData = req.body.lootData;
        processGargulLootData(guildID, itemData, req, res);
      }
    } catch (err) {
      console.log(err);
      if (err instanceof SyntaxError) {
        return res.status(400).json({ message: "Invalid JSON" });
      } else {
        return res.status(500).json({ message: "Error Writing to DB" });
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
