import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Emit a fully static site to ./out on `next build`.
  output: "export",
  // The default image optimizer needs a server; static export can't use it.
  images: { unoptimized: true },
};

export default nextConfig;
