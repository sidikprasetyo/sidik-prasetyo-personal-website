import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/home',
        permanent: false, // ubah ke true kalau memang permanen
      },
    ]
  },
};

export default nextConfig;
