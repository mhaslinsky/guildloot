import { isValidTimeout } from "@tanstack/query-core/build/lib/utils";
import { prisma } from "../../server/db/client";
import { RCLootItem } from "../types";

export default async function createRCLootItemRecord(item: RCLootItem) {
  try {
    await prisma.rcLootItem.create({
      data: {
        id: item.id,
        player: item.player,
        dateTime: item.dateTime,
        itemId: item.itemID,
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
      },
    });
  } catch (error) {
    console.log(error);
    throw error;
  }
}
