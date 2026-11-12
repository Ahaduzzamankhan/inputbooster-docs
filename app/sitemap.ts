import type { MetadataRoute } from "next";
import { getAllDocs } from "@/lib/docs";
import { site } from "@/lib/site";

// The site is exported as static files for GitHub Pages.
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // The export uses directory-style URLs, so every entry ends in a slash.
  const url = (path: string) => `${site.url}${path === "/" ? "/" : `${path}/`}`;

  const docs = getAllDocs().map((doc) => ({
    url: url(doc.href),
    lastModified: doc.updated ? new Date(doc.updated) : new Date(),
    changeFrequency: "monthly" as const,
    priority: doc.section.id === "getting-started" ? 0.9 : 0.7,
  }));

  const sections = getAllDocs()
    .filter((doc, index, all) => all.findIndex((other) => other.section.id === doc.section.id) === index)
    .map((doc) => ({
      url: url(`/docs/${doc.section.id}`),
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));

  return [
    {
      url: url("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: url("/docs"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...sections,
    ...docs,
  ];
}
