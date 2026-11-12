/**
 * Site-wide constants.
 *
 * `basePath` exists because the site is published as a GitHub Pages project
 * site, which is served from `https://<owner>.github.io/<repo>`. Next.js
 * prefixes `next/link` and `next/image` URLs with `basePath` on its own, but
 * plain anchors — the markdown links inside the MDX content — have to be
 * prefixed by hand.
 */

export const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/**
 * The social preview image.
 *
 * Next writes the generated image to `out/opengraph-image`, which has no
 * file extension and would be served by GitHub Pages as
 * application/octet-stream. The build copies it to `og.png` so the URL ends
 * in a real image extension.
 */
export const ogImage = "/og.png";

export function withBasePath(href: string): string {
  if (!href || !href.startsWith("/")) return href;
  if (href.startsWith("//")) return href;
  if (!basePath) return href;
  if (href === basePath || href.startsWith(`${basePath}/`)) return href;
  return `${basePath}${href}`;
}

export const site = {
  name: "InputBooster",
  title: "InputBooster Documentation",
  description:
    "Source-verified documentation for InputBooster, a client-side Minecraft mod that samples input faster than the game tick.",
  version: "4.1.2-alpha",
  minecraft: "26.2 / 26.3",
  java: "25",
  github: "https://github.com/Ahaduzzamankhan/inputbooster",
  issues: "https://github.com/Ahaduzzamankhan/inputbooster/issues",
  docs: "https://github.com/Ahaduzzamankhan/inputbooster-docs",
  license: "MIT",
  author: "Ahaduzzaman Khan",
  /**
   * The public origin of the deployed site, without a trailing slash. The
   * base path is already part of it when the site is deployed under a
   * project path, so it is not appended again here.
   */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
} as const;

export const topLinks = [
  { href: "/docs/getting-started/overview", label: "Docs" },
  { href: "/docs/guide/settings", label: "Gamer Guide" },
  { href: "/docs/developers/architecture", label: "Developers" },
  { href: "/docs/releases/changelog", label: "Releases" },
] as const;
