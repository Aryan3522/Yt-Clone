import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactStrictMode: true,
  env:{
    BACKEND_URL : process.env.BACKEND_URL || "http://localhost:5771/"
  }
};

export default nextConfig;
