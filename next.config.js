/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.imgur.com", "images.unsplash.com", "cdn.discordapp.com", "*"],
  },
  env: {
    BLIZZ_API_TOKEN: process.env.BLIZZ_API_TOKEN,
    BLIZZ_CLIENT_ID: process.env.BLIZZ_CLIENT_ID,
    BLIZZ_CLIENT_SECRET: process.env.BLIZZ_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL,
    DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
    DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,
    HOST: process.env.HOST,
    SERVICE: process.env.SERVICE,
    USER: process.env.USER,
    PASS: process.env.PASS,
    FROM: process.env.FROM,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
