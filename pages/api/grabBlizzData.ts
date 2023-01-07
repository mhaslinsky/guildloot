import type { NextApiRequest, NextApiResponse } from "next";
import createBlizzAPIItem from "../../utils/functions/writeItemToDB";
import type { blizzAPIItem, blizzAPIMedia } from "../../utils/types";

export default async function writeBlizzDatatoLocal(req: NextApiRequest, res: NextApiResponse) {
  try {
    const item = await createBlizzAPIItem(req.body);
    res.status(200).json({ message: ` written to DB successfully`, item: req.body.id });
  } catch (error) {
    res.status(500).json({ error });
  }
}
