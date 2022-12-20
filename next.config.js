/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["i.imgur.com", "images.unsplash.com", "*"],
  },
  env: {
    BLIZZ_API_TOKEN: process.env.BLIZZ_API_TOKEN,
  },
  reactStrictMode: true,
};

module.exports = nextConfig;
