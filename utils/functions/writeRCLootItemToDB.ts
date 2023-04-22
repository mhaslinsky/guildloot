import { lootItem } from "@prisma/client";
import { formValues } from "../../components/EditForm";
import { formattedGargulData, formattedRCItem } from "../../pages/api/loot/[lgid]";
import { prisma } from "../../prisma/client";

export async function createRCLootItemRecord(item: formattedRCItem, req: any) {
  const linkID = item.itemID;
  try {
    await prisma.lootItem.create({
      data: {
        trackerId: item.id,
        source: "RC",
        player: item.player,
        date: item.date,
        time: item.time,
        dateTime: item.dateTime,
        itemString: item.itemString,
        response: item.response,
        responseID: item.responseID,
        votes: item.votes,
        class: item.class,
        instance: item.instance,
        boss: item.boss,
        gear1: item.gear1,
        gear2: item.gear2,
        isAwardReason: item.isAwardReason,
        rollType: item.rollType,
        subType: item.subType,
        equipLoc: item.equipLoc,
        note: item.note,
        owner: item.owner,
        itemName: item.itemName,
        raidSize: item.raidSize == 25 ? "TWENTY_FIVE" : "TEN",
        guild: { connect: { id: item.guildId } },
        bLootDBItem: { connect: { id: linkID } },
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    req.badRecord = item.id;
    throw "rclootID: " + item.id + " error: " + error;
  }
}

export async function createGargulLootItemRecord(item: formattedGargulData, req: any) {
  const linkID = item.itemID;
  try {
    await prisma.lootItem.create({
      data: {
        trackerId: item.trackerId,
        source: "GARGUL",
        player: item.player,
        date: item.dateTime != null ? item.dateTime : undefined,
        dateTime: item.dateTime != null ? item.dateTime : undefined,
        itemName: item.itemName,
        offspec: item.offspec,
        response: item.response,
        boss: item.boss,
        instance: item.instance,
        raidSize: item.raidSize == 25 ? "TWENTY_FIVE" : "TEN",
        guild: { connect: { id: item.guild } },
        bLootDBItem: { connect: { id: linkID } },
        updatedAt: new Date(),
      },
    });
  } catch (error) {
    req.badRecord = item.trackerId;
    throw "rclootID: " + item.trackerId + " error: " + error;
  }
}

export async function updateLootItemRecord(
  updateData: formValues,
  lootRow: lootItem,
  currentGuildID: string,
  req: any
) {
  try {
    const existingLootItem = await prisma.lootItem.findUnique({
      where: { id: lootRow.id },
      select: { guildId: true },
    });

    if (!existingLootItem || existingLootItem.guildId !== currentGuildID) {
      throw new Error("Guild ID does not match");
    }

    await prisma.lootItem.update({
      where: { id: lootRow.id },
      data: {
        ...(updateData.player && { player: updateData.player }),
        ...(updateData.instance && { instance: updateData.instance }),
        ...(updateData.boss && { boss: updateData.boss }),
        ...(updateData.size && {
          raidSize: updateData.size == "25" ? "TWENTY_FIVE" : "TEN",
        }),
        ...(updateData.reason && { response: updateData.reason }),
      },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}

export async function deleteLootItemRecord(lootRow: lootItem, currentGuildID: string, req: any) {
  try {
    const existingLootItem = await prisma.lootItem.findUnique({
      where: { id: lootRow.id },
      select: { guildId: true },
    });

    if (!existingLootItem || existingLootItem.guildId !== currentGuildID) {
      throw new Error("Guild ID does not match");
    }

    await prisma.lootItem.delete({
      where: { id: lootRow.id },
    });
  } catch (e) {
    console.log(e);
    throw e;
  }
}
