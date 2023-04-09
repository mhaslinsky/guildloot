import { getCookie } from "cookies-next";
import { prisma } from "../../../prisma/client";
import { Prisma } from "@prisma/client";

export default async function createGuildEndpoint(req: any, res: any) {
  const token =
    (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
    (getCookie("next-auth.session-token", { req, res }) as string);

  if (req.method == "POST") {
    const { guildName, server, avatar } = req.body;
    try {
      const userSession = await prisma.session.findUnique({
        where: { sessionToken: token },
        include: { user: { include: { guildAdmin: true, guildOfficer: true, guildMember: true } } },
      });

      if (!userSession) return res.status(401).json({ message: "Unauthorized" });

      const guildAdminships = userSession?.user.guildAdmin || [];

      if (guildAdminships.length >= 3)
        return res
          .status(401)
          .json({ message: "Already admin of 3 guilds, delete a guild, or pass admin of one to another user." });

      const guild = await prisma.guild.create({
        data: { name: guildName, server: server, image: avatar, adminId: userSession!.user.id },
      });

      return res.status(200).json({ message: "Guild created succesfully", guild });
    } catch (e) {
      if (e instanceof Prisma.PrismaClientKnownRequestError) {
        console.log(e.code);
        if (e.code == "P2002") {
          return res.status(400).json({ message: "Guild name already taken" });
        }
      }
      console.log("error on guild creation: " + e);
      return res.status(500).json({ message: "Error Creating Guild" });
    }
  }
}
