import next, { NextApiRequest } from "next";
import { prisma } from "../../prisma/client";
import { rcLootItem } from "@prisma/client";
import { RCLootItem } from "../../utils/types";

interface ApiResponse<T> {
  data?: T;
  error?: any;
}

export default async function createRCLootItemRecord(item: RCLootItem, req: any) {
  const linkID = item.itemID;
  try {
    await prisma.rcLootItem.create({
      data: {
        id: item.id,
        player: item.player,
        dateTime: item.dateTime != null ? item.dateTime : undefined,
        itemString: item.itemString,
        response: item.response,
        votes: item.votes,
        class: item.class,
        instance: item.instance,
        boss: item.boss,
        gear1: item.gear1,
        gear2: item.gear2,
        responseId: item.responseID,
        isAwardReason: item.isAwardReason,
        rollType: item.rollType,
        subType: item.subType,
        equipLoc: item.equipLoc,
        note: item.note,
        owner: item.owner,
        itemName: item.itemName,
        guild: { connect: { id: item.guild } },
        bLootDBItem: { connect: { id: linkID } },
      },
    });
  } catch (error) {
    req.badRecord = item.id;
    throw "rclootID: " + item.id + " error: " + error;
  }
}
