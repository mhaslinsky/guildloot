import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../prisma/client";
import EmailProvider from "next-auth/providers/email";
import { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    EmailProvider({
      server: {
        host: process.env.HOST,
        port: 587,
        auth: {
          user: process.env.USER,
          pass: process.env.PASS,
        },
      },
      from: process.env.FROM,
      maxAge: 24 * 60 * 60, // How long email links are valid for
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      httpOptions: {
        timeout: 40000,
      },
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      httpOptions: {
        timeout: 40000,
      },
    }),
    // ...add more providers here
  ],
  session: {
    strategy: "database",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async redirect({ url, baseUrl }) {
      return Promise.resolve("/");
    },
    async signIn({ user, account, profile, email, credentials }) {
      const curDateTime = new Date();
      if (user.email != null) {
        try {
          const curUser = await prisma.user.update({
            where: { email: user.email },
            data: { lastSignedIn: curDateTime },
          });
        } catch (e) {
          console.log(e);
        }
        return true;
      }
      return true;
    },
    async session({ session, user, token }) {
      const curDateTime = new Date();
      if (user.email != null) {
        try {
          const curUser = await prisma.user.update({
            where: { email: user.email },
            data: { lastSignedIn: curDateTime },
          });
        } catch (e) {
          console.log(e);
        }
        return session;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
