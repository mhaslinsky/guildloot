import { getServerSession } from "next-auth";
import { prisma } from "../../prisma/client";
import { authOptions } from "./auth/[...nextauth]";
import { NextApiRequest, NextApiResponse } from "next";
import { getCookie } from "cookies-next";

export async function auth(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);

  const token =
    (getCookie("__Secure-next-auth.session-token", { req, res }) as string) ||
    (getCookie("next-auth.session-token", { req, res }) as string);

  if (!session || !token) {
    return;
  } else {
    return { session, token };
  }
}

export default async function userProfileEndpoint(req: NextApiRequest, res: NextApiResponse) {
  const response = await auth(req, res);
  if (response) {
    const { session, token } = response;
    const { propToChange, value } = req.body;

    if (req.method == "POST") {
      try {
        const user = await prisma.session.findUnique({
          where: { sessionToken: token },
          include: { user: true },
        });

        const userId = user?.userId;

        if (propToChange === "username") {
          const update = await prisma.user.update({
            where: { id: userId },
            data: { name: value },
          });
        }

        if (propToChange === "image") {
          const update = await prisma.user.update({
            where: { id: userId },
            data: { image: value },
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(500).json({ message: "Internal Server Error" });
      }

      return res.status(200).json({ message: "Profile Updated!" });
    } else {
      res.status(405).json({ message: "Method not allowed" });
    }
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }
}
