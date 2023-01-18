import { prisma } from "../../server/db/client";
import { RCLootItem } from "../types";

export default async function createRCLootItemRecord(item: RCLootItem) {
  const linkID = item.itemId;
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
        bLootDBItem: { connect: { id: linkID } },
      },
    });
  } catch (error) {
    console.log("rclootID: " + item.id + error);
    throw error;
  }
}
