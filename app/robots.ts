import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

// The site is exported as static files for GitHub Pages.
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
