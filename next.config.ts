import type { NextConfig } from "next";
import path from "node:path";

/**
 * The site is published to GitHub Pages as a project site:
 * https://ahaduzzamankhan.github.io/inputbooster-docs
 *
 * That means two things:
 *   - the build is a static export, because Pages has no server runtime;
 *   - the base path has to be part of the build, because every asset and
 *     every internal link is served from under /inputbooster-docs.
 *
 * `NEXT_PUBLIC_BASE_PATH` and `NEXT_PUBLIC_SITE_URL` are set by the deploy
 * workflow. They are empty locally, which keeps `next dev` on http://localhost:3000.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  serverExternalPackages: ["shiki"],
  // The project lives inside a home directory that also holds a package.json.
  // Pinning the Turbopack root keeps Next from picking up the outer lockfile.
  turbopack: {
    root: path.resolve(process.cwd()),
  },
  // GitHub Pages serves static files only.
  output: "export",
  basePath,
  // Directory-style URLs: /docs/guide/settings/ maps to
  // docs/guide/settings/index.html, which is what Pages serves.
  trailingSlash: true,
  images: {
    // The Pages build has no image optimisation server.
    unoptimized: true,
  },
};

export default nextConfig;
