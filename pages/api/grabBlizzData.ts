import type { NextApiRequest, NextApiResponse } from "next";
import createBlizzAPIItem from "../../utils/functions/writeItemToDB";
import type { blizzAPIItem, blizzAPIMedia } from "../../utils/types";
import blizzAPI from "../../utils/blizzApi";

export default async function writeBlizzDatatoLocal(req: NextApiRequest, res: NextApiResponse) {
  const itemId = req.body.itemId;
  try {
    //@ts-ignore
    const data: blizzAPIItem = await blizzAPI.query(
      `/data/wow/item/${itemId}?namespace=static-classic-us&locale=en_US`
    );
    const mediaEndpoint = data.media.key.href;
    const itemName = data.name;
    //@ts-ignore
    const itemIconData: blizzAPIMedia = await blizzAPI.query(mediaEndpoint.replace("https://us.api.blizzard.com", ""));
    const itemIcon = itemIconData.assets[0].value;
    const itemID = data.id;
    await createBlizzAPIItem({ ...data, ...itemIconData });
    res.status(200).json({ message: ` written to DB successfully`, itemID, itemName, itemIcon });
  } catch (error) {
    res.status(500).json({ error, message: "error writing to DB" });
  }
}
