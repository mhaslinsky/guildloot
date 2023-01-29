import { prisma } from "../../prisma/client";
import { NextApiRequest, NextApiResponse } from "next";
import createRCLootItemRecord from "../../utils/functions/writeRCLootItemToDB";
import type { RCLootItem } from "../../utils/types";

export default async function writeRCLootItemToDB(req: any, res: any) {
  if (req.method == "POST") {
    try {
      const itemData: any[] = JSON.parse(req.body.rcLootData);
      console.log(itemData);
      itemData.forEach(async (item) => {
        const { isAwardReason, date, time, ...itemData } = item;
        const dateTimeString = `${date} ${time}`;
        const dateTime = new Date(dateTimeString);
        const newItem: RCLootItem = { ...itemData, dateTime, isAwardReason: isAwardReason === "true" ? true : false };
        await createRCLootItemRecord(newItem);
      });
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
