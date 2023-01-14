import { NextApiRequest, NextApiResponse } from "next";
import createRCLootItemRecord from "../../utils/functions/writeRCLootItemToDB";
import type { RCLootItem } from "../../utils/types";

export default async function writeRCLootItemToDB(req: NextApiRequest, res: NextApiResponse) {
  try {
    const itemData: any[] = JSON.parse(req.body.rcLootData);
    itemData.forEach(async (item) => {
      console.log(item);
      const { isAwardReason, date, time, ...itemData } = item;
      const dateTimeString = `${date} ${time}`;
      const dateTime = new Date(dateTimeString);
      const newItem: RCLootItem = { ...itemData, dateTime, isAwardReason: isAwardReason === "true" ? true : false };
      await createRCLootItemRecord(newItem);
    });
    res.status(200).json({ message: ` written to DB successfully` });
  } catch (error) {
    res.status(500).json({ error, message: "error writing to DB" });
  }
}
