import { prisma } from "../../../prisma/client";
import { getServerSession } from "next-auth";
import {
  createRCLootItemRecord,
  createGargulLootItemRecord,
  updateLootItemRecord,
  deleteLootItemRecord,
} from "../../../utils/functions/writeRCLootItemToDB";
import { authOptions } from "../auth/[...nextauth]";
import { getCookie } from "cookies-next";
import Papa from "papaparse";
import Database from "wow-classic-items";
import { Item } from "wow-classic-items/types/Item";
import { TrackerSource, lootItem } from "@prisma/client";
import { RCLootItem } from "../../../utils/types";
import { checkUserRoles } from "../guildInfo/[gid]";
import { formValues } from "../../../components/EditForm";

type PapaReturn = {
  dateTime: string;
  character: string;
  itemID: number;
  offspec: number;
  id: string;
};

export type formattedGargulData = {
  trackerId: string;
  itemID: number;
  itemName: string;
  dateTime: Date;
  offspec: number;
  player: string;
  boss: string;
  instance: string;
  guild: string;
  response: string;
  raidSize: 10 | 25;
};

export type formattedRCItem = {
  instance: string;
  raidSize: 25 | 10;
  guildId: string;
  isAwardReason: boolean;
  id: string;
  itemID: number;
  trackerId: string;
  source: TrackerSource;
  player: string;
  date: Date | null;
  time: string | null;
  dateTime: Date | null;
  itemString: string | null;
  response: string | null;
  responseID: string | null;
  votes: number | null;
  class: string | null;
  boss: string | null;
  gear1: string | null;
  gear2: string | null;
  rollType: string | null;
  subType: string | null;
  equipLoc: string | null;
  note: string | null;
  owner: string | null;
  itemName: string | null;
};

const items = new Database.Items({ iconSrc: "wowhead" });
const zones = new Database.Zones({ iconSrc: "wowhead" });

function formatRCItem(item: RCLootItem, guildID: string) {
  const { isAwardReason, instance, date, response, player, ...itemData } = item;
  const playerNoServer = player.split("-")[0];
  const instanceArray = instance!.split("-");
  const convertedDate = new Date(date as string);
  const newItem: formattedRCItem = {
    ...itemData,
    response,
    date: convertedDate,
    player: response == "Disenchant" ? "Disenchanted" : playerNoServer,
    instance: instanceArray[0],
    raidSize: instanceArray[1] == "25 Player" ? 25 : 10,
    guildId: guildID,
    isAwardReason: isAwardReason === true ? true : false,
    trackerId: item.id,
    source: "RC",
  };
  return newItem;
}

function getInstanceFromBoss(bossName: string) {
  const naxxramasBosses = [
    "Anub'Rekhan",
    "Faerlina",
    "Maexxna",
    "Noth the Plaguebringer",
    "Heigan the Unclean",
    "Loatheb",
    "Instructor Razuvious",
    "Gothik the Harvester",
    "The Four Horsemen",
    "Patchwerk",
    "Grobbulus",
    "Gluth",
    "Thaddius",
    "Sapphiron",
    "Kel'Thuzad",
  ];
  const eyeOfEternityBosses = ["Malygos"];
  const vaultOfArchavonBosses = [
    "Archavon the Stone Watcher",
    "Emalon the Storm Watcher",
    "Koralon the Flame Watcher",
    "Toravon the Ice Watcher",
  ];
  const ulduarBosses = [
    "Flame Leviathan",
    "Ignis the Furnace Master",
    "Razorscale",
    "XT-002 Deconstructor",
    "The Iron Council",
    "Kologarn",
    "Auriaya",
    "Freya",
    "Thorim",
    "Mimiron",
    "Hodir",
    "General Vezax",
    "Yogg-Saron",
    "Algalon the Observer",
  ];

  if (naxxramasBosses.includes(bossName)) return "Naxxramas";
  if (eyeOfEternityBosses.includes(bossName)) return "Eye of Eternity";
  if (vaultOfArchavonBosses.includes(bossName)) return "Vault of Archavon";
  if (ulduarBosses.includes(bossName)) return "Ulduar";
  return null;
}

function getInstanceFromContentPhase(
  droppedBy: string | undefined,
  contentPhase: number | undefined,
  itemId: number
) {
  let rInstance;
  let rDroppedBy = droppedBy;
  if (rDroppedBy === "Steelbreaker") rDroppedBy = "The Iron Council";
  if (rDroppedBy) rInstance = getInstanceFromBoss(rDroppedBy);
  else if (contentPhase && itemId >= 35574) {
    switch (contentPhase) {
      case 1:
        rInstance = "Naxx/OS/EoE";
        break;
      case 2:
        rInstance = "Ulduar";
        break;
      case 3:
        rInstance = "Trial of the Crusader";
        break;
      case 4:
        rInstance = "Icecrown Citadel";
        break;
      case 5:
        rInstance = "Ruby Sanctum";
        break;
      default:
        rInstance = "Unknown";
    }
  }
  return { rInstance, rDroppedBy };
}

async function processRCLootData(guildID: any, itemData: RCLootItem[] | RCLootItem, req: any, res: any) {
  if (Array.isArray(itemData)) {
    if (itemData.length === 0) return res.status(400).json({ message: `Enter Valid Loot` });

    const promises = itemData.map(async (item, index) => {
      const formattedItem = formatRCItem(item, guildID);
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
          message: `Error writing to loot history for all ${itemData.length} items. Did you submit twice?`,
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
    // const singularItem = JSON.parse(req.body.lootData);
    const formattedItem = formatRCItem(itemData, guildID);

    try {
      await createRCLootItemRecord(formattedItem, req);
    } catch (err) {
      console.error(`failed to write ${itemData.itemName} to db:`, err);
      return res.status(500).json({ message: `Error writing to loot history for ${itemData.itemName}` });
    }

    return res.status(200).json({ message: `Written to Loot History Successfully` });
  }
}

async function processGargulLootData(guildID: any, itemData: any, req: any, res: any) {
  const raidSize = req.body.raidSize;
  const parsedData = Papa.parse(itemData, { header: true, dynamicTyping: true }).data as PapaReturn[];

  const formattedData = parsedData.map((item) => {
    const { itemID, dateTime, character, offspec, id } = item;
    const itemData = items.find((item) => item.itemId == itemID) as Item & { contentPhase?: number };

    if (!itemData) {
      console.log(`Item ${itemID} not found in database`);
      return itemID;
    } else {
      let droppedBy;
      let instance;

      if (itemData.source) {
        if (itemData.source.category === "Boss Drop") {
          droppedBy = itemData.source.name;

          const instanceZoneID = itemData.source.zone;

          instance = zones.find((zone) => zone.id == instanceZoneID)?.name;
        } else if (itemData.source.category === "Zone Drop") {
          droppedBy = zones.find((zone) => zone.id == itemData.source.zone)?.name;

          instance = zones.find((zone) => zone.id == itemData.source.zone)?.name;
        } else if (itemData.source.category === "Vendor") {
          const tooltipArray = itemData.tooltip;

          const droppedByLabel = tooltipArray.find((tooltip) => tooltip.label.match(/^Dropped by: (.*)/)?.[1]);
          droppedBy = droppedByLabel?.label.substring(12);

          const { rInstance, rDroppedBy } = getInstanceFromContentPhase(
            droppedBy,
            itemData.contentPhase,
            itemData.itemId
          );
          instance = rInstance;
          droppedBy = rDroppedBy;
        }
      } else {
        const tooltipArray = itemData.tooltip;

        const droppedByLabel = tooltipArray.find((tooltip) => tooltip.label.match(/^Dropped by: (.*)/)?.[1]);
        droppedBy = droppedByLabel?.label.substring(12);

        const { rInstance, rDroppedBy } = getInstanceFromContentPhase(
          droppedBy,
          itemData.contentPhase,
          itemData.itemId
        );
        instance = rInstance;
        droppedBy = rDroppedBy;
      }

      const returnValue: formattedGargulData = {
        trackerId: id,
        itemID,
        guild: guildID,
        itemName: itemData.name || "Unknown",
        dateTime: new Date(dateTime),
        offspec,
        response: character == "_disenchanted" ? "Disenchanted" : offspec ? "Offspec" : "Mainspec",
        player: character == "_disenchanted" ? "Disenchanted" : character,
        boss: droppedBy || "Multiple/Unknown",
        instance: instance || "Unknown",
        raidSize,
      };

      return returnValue;
    }
  });

  const promises = formattedData.map(async (item, index) => {
    //catching items with ID's that don't exist in the database
    if (typeof item === "number") {
      return item;
    } else {
      try {
        await createGargulLootItemRecord(item!, req);
        console.log(`finished writing ${item?.itemName} from ${item?.boss} number ${index + 1} to db`);
      } catch (err) {
        console.error(`failed to write ${item?.itemName} number ${index + 1} to db:`, err);
        return item;
      }
    }
  });

  const badItems = (await Promise.all(promises)).filter(Boolean);
  console.log("bad gargul items:", badItems);
  if (badItems.length > 0) {
    if (badItems.length === formattedData.length)
      return res.status(500).json({
        message: `Error writing to loot history for all ${formattedData.length} items. Did you submit twice?`,
      });
    return res.status(207).json({
      message: `Succeeded writing ${formattedData.length - badItems.length} of ${formattedData.length} items`,
      badItems,
      code: 207,
    });
  } else {
    return res.status(200).json({ message: `Written to Loot History Successfully` });
  }
}

export default async function lootEndpoint(req: any, res: any) {
  if (req.method == "POST") {
    try {
      const guildID = req.body.currentGuild;
      const addon = req.body.addon;

      if (addon === "RCLootCouncil") {
        // const itemData = JSON.parse(req.body.lootData);
        processRCLootData(guildID, req.body.lootData, req, res);
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
      await prisma.lootItem
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
  } else if (req.method == "PATCH") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(405).json({ message: "Not logged in, how are you here?" });

    const token =
      (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
      (getCookie("next-auth.session-token", { req, res }) as string);
    if (!token) return res.status(405).json({ message: "Not logged in, or blocking cookies." });

    const {
      lootRows,
      updateValues,
      currentGuildID,
    }: { lootRows: lootItem[]; updateValues: formValues; currentGuildID: string } = req.body;

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

      const { adminofReqGuild, officerofReqGuild } = checkUserRoles(userSession, currentGuildID);

      if (!(adminofReqGuild || officerofReqGuild))
        return res.status(401).json({ message: "Only admins and officers can edit loot" });
    } catch (e) {
      console.log(e);
    }

    try {
      const promises = lootRows.map(async (lootRow) => {
        updateLootItemRecord(updateValues, lootRow, currentGuildID, req);
      });

      const results = await Promise.all(promises);
      console.log(results);
    } catch (e) {
      console.log(e);
      return res.status(405).json({ message: "error" });
    }

    return res.status(200).json({ message: "success" });
  } else if (req.method == "DELETE") {
    const session = await getServerSession(req, res, authOptions);
    if (!session) return res.status(405).json({ message: "Not logged in, how are you here?" });

    const token =
      (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
      (getCookie("next-auth.session-token", { req, res }) as string);
    if (!token) return res.status(405).json({ message: "Not logged in, or blocking cookies." });

    const { lootRows, currentGuildID }: { lootRows: lootItem[]; currentGuildID: string } = req.body;

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

      const { adminofReqGuild, officerofReqGuild } = checkUserRoles(userSession, currentGuildID);

      if (!(adminofReqGuild || officerofReqGuild))
        return res.status(401).json({ message: "Only admins and officers can edit loot" });

      const promises = lootRows.map(async (lootRow) => {
        deleteLootItemRecord(lootRow, currentGuildID, req);
      });

      const results = await Promise.all(promises);
      console.log(results);
    } catch (e) {
      console.log(e);
      return res.status(405).json({ message: "error", error: e });
    }

    return res.status(200).json({ message: "success" });
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
