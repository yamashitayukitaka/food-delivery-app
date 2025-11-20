import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  logging: {
    fetches: { fullUrl: true },
  },
  // fetch通信の内容（URLやキャッシュの有無を含む）をターミナルで確認する設定
  experimental: {
    useCache: true,
  },
  //use cache を有効にする設定
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'places.googleapis.com',
      },
    ],
  },

};

export default nextConfig;


