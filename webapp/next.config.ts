import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  // Pinned so the two-pass build (build → emit precache manifest → build) is
  // deterministic: identical asset paths across passes keep the SW manifest valid.
  generateBuildId: () => "superhero-static",
};

export default nextConfig;
