import type { NextConfig } from "next";

const api = process.env.API_PROXY_TARGET ?? "http://127.0.0.1:43124";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: `${api}/api/:path*`,
      },
    ];
  },
};

export default nextConfig;
