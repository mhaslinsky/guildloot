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
    console.log(session, token);
  } else {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (req.method == "POST") {
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
