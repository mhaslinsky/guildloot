/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.imgur.com", "images.unsplash.com", "*"],
  },
  env: {
    BLIZZ_API_TOKEN: process.env.BLIZZ_API_TOKEN,
    BLIZZ_CLIENT_ID: process.env.BLIZZ_CLIENT_ID,
    BLIZZ_CLIENT_SECRET: process.env.BLIZZ_CLIENT_SECRET,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
