import { prisma } from "../../prisma/client";

export default async function guildsEndpoint(req: any, res: any) {
  if (req.method == "GET") {
    try {
      const guilds = await prisma.guild.findMany();
      res.status(200).json(guilds);
    } catch (err: unknown) {
      console.log(err);
      res.status(500).json({ message: "Error Fetching Guilds" });
    }
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
