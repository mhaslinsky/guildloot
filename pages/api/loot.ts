import { prisma } from "../../server/db/client";
import { NextApiRequest, NextApiResponse } from "next";
import createRCLootItemRecord from "../../utils/functions/writeRCLootItemToDB";
import type { RCLootItem } from "../../utils/types";

export default async function writeRCLootItemToDB(req: NextApiRequest, res: NextApiResponse) {
  if (req.method == "POST") {
    try {
      const itemData: any[] = JSON.parse(req.body.rcLootData);
      itemData.forEach(async (item) => {
        const { isAwardReason, date, time, ...itemData } = item;
        const dateTimeString = `${date} ${time}`;
        const dateTime = new Date(dateTimeString);
        const newItem: RCLootItem = { ...itemData, dateTime, isAwardReason: isAwardReason === "true" ? true : false };
        await createRCLootItemRecord(newItem);
      });
      res.status(200).json({ message: ` written to DB successfully` });
    } catch (err) {
      res.status(500).json({ err, message: "error writing to DB" });
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
      res.status(500).json({ err, message: "error reading from DB" });
    }
  } else {
    return res.status(405).json({ message: "Method not allowed" });
  }
}
