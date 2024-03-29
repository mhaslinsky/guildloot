import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import DiscordProvider from "next-auth/providers/discord";
import BattleNetProvider from "next-auth/providers/battlenet";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "../../../prisma/client";
import EmailProvider from "next-auth/providers/email";
import { type NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  // Configure one or more authentication providers
  providers: [
    BattleNetProvider({
      clientId: process.env.BLIZZ_CLIENT_ID!,
      clientSecret: process.env.BLIZZ_CLIENT_SECRET!,
      issuer: "https://us.battle.net/oauth",
      authorization: {
        params: {
          scope: "openid wow.profile",
        },
      },
    }),
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
  events: {},
  callbacks: {
    async redirect({ url, baseUrl }) {
      return Promise.resolve("/");
    },
    async signIn({ user, account, profile, email, credentials }) {
      console.log("signIn", user, account, profile, email, credentials);
      const curDateTime = new Date();
      const oneMinuteAgo = new Date(curDateTime.getTime() - 1 * 1000);
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastSignedIn: oneMinuteAgo },
        });
      } catch (e) {
        console.log(e);
      }
      return true;
    },
    async session({ session, user, token }) {
      const curDateTime = new Date();
      const oneMinuteAgo = new Date(curDateTime.getTime() - 1 * 1000);
      try {
        await prisma.user.update({
          where: { id: user.id },
          data: { lastSignedIn: oneMinuteAgo },
        });
      } catch (e) {
        console.log(e);
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
