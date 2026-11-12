import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";
import { sections, type Section } from "@/lib/sections";

export type Heading = {
  id: string;
  text: string;
  depth: 2 | 3;
};

export type DocFrontmatter = {
  title: string;
  description: string;
  order?: number;
  group?: string;
  badge?: string;
  updated?: string;
};

export type DocPage = {
  section: Section;
  slug: string;
  slugPath: string[];
  href: string;
  title: string;
  description: string;
  group?: string;
  badge?: string;
  updated?: string;
  order: number;
  source: string;
  headings: Heading[];
  content: string;
  plainText: string;
  readingMinutes: number;
};

export type NavItem = {
  title: string;
  href: string;
  description: string;
  badge?: string;
};

export type NavGroup = {
  name: string | null;
  items: NavItem[];
};

export type NavSection = Section & {
  groups: NavGroup[];
  href: string;
};

const CONTENT_DIR = path.join(process.cwd(), "content", "docs");
const DOC_FILE = /\.mdx$/;

let cache: DocPage[] | null = null;

function listMdxFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) return [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries.flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listMdxFiles(full);
    return DOC_FILE.test(entry.name) ? [full] : [];
  });
}

function stripMarkdown(value: string): string {
  return value
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, " ")
    .replace(/[`*_~]/g, "")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(source: string): Heading[] {
  const slugger = new GithubSlugger();
  const headings: Heading[] = [];
  let inFence = false;

  for (const line of source.split(/\r?\n/)) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }
    if (inFence) continue;
    const match = /^(#{2,3})\s+(.+?)\s*#*\s*$/.exec(line);
    if (!match) continue;
    const text = stripMarkdown(match[2]);
    if (!text) continue;
    headings.push({
      id: slugger.slug(text),
      text,
      depth: match[1].length === 2 ? 2 : 3,
    });
  }

  return headings;
}

export function toPlainText(source: string): string {
  return source
    .replace(/^\s*import\s.+$/gm, " ")
    .replace(/^\s*export\s.+$/gm, " ")
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/~~~[\s\S]*?~~~/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, " ")
    .replace(/^\s*[-*+]\s+/gm, " ")
    .replace(/^\s*\d+\.\s+/gm, " ")
    .replace(/^\s*>\s?/gm, " ")
    .replace(/[`*_~|]/g, " ")
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function readDocFile(file: string): DocPage {
  const relative = path.relative(CONTENT_DIR, file).replace(/\\/g, "/");
  const [sectionId, ...rest] = relative.replace(DOC_FILE, "").split("/");
  const section = sections.find((item) => item.id === sectionId);
  if (!section) {
    throw new Error(`Unknown docs section "${sectionId}" in ${relative}. Add it to content/sections.json.`);
  }

  const raw = fs.readFileSync(file, "utf8");
  const parsed = matter(raw);
  const data = parsed.data as Partial<DocFrontmatter>;

  if (!data.title || !data.description) {
    throw new Error(`Missing title or description frontmatter in ${relative}.`);
  }

  const slug = rest.join("/");
  const href = `/docs/${section.id}/${slug}`;
  const plainText = toPlainText(parsed.content);
  const words = plainText ? plainText.split(/\s+/).length : 0;

  return {
    section,
    slug,
    slugPath: [section.id, ...rest],
    href,
    title: data.title,
    description: data.description,
    group: data.group,
    badge: data.badge,
    updated: data.updated,
    order: data.order ?? 999,
    source: parsed.content,
    headings: extractHeadings(parsed.content),
    content: parsed.content,
    plainText,
    readingMinutes: Math.max(1, Math.round(words / 220)),
  };
}

export function getAllDocs(): DocPage[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  const docs = listMdxFiles(CONTENT_DIR)
    .map(readDocFile)
    .sort((a, b) => {
      if (a.section.order !== b.section.order) return a.section.order - b.section.order;
      if (a.order !== b.order) return a.order - b.order;
      return a.title.localeCompare(b.title);
    });
  cache = docs;
  return docs;
}

export function getDoc(slugPath: string[]): DocPage | undefined {
  if (slugPath.length !== 2) return undefined;
  return getAllDocs().find(
    (doc) => doc.section.id === slugPath[0] && doc.slug === slugPath[1],
  );
}

export function getNav(): NavSection[] {
  return sections.map((section) => {
    const docs = getAllDocs().filter((doc) => doc.section.id === section.id);
    const grouped = new Map<string | null, DocPage[]>();
    for (const doc of docs) {
      const key = doc.group ?? null;
      const existing = grouped.get(key) ?? [];
      existing.push(doc);
      grouped.set(key, existing);
    }

    const groups: NavGroup[] = [...grouped.entries()]
      .map(([name, items]) => ({
        name,
        items: items
          .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title))
          .map((doc) => ({
            title: doc.title,
            href: doc.href,
            description: doc.description,
            badge: doc.badge,
          })),
        order: items.reduce((min, item) => Math.min(min, item.order), 999),
      }))
      .sort((a, b) => {
        if (a.name === null) return -1;
        if (b.name === null) return 1;
        return a.order - b.order;
      })
      .map(({ name, items }) => ({ name, items }));

    return {
      ...section,
      groups,
      href: docs[0]?.href ?? `/docs/${section.id}`,
    };
  });
}

export function getAdjacentDocs(slugPath: string[]) {
  const docs = getAllDocs();
  const index = docs.findIndex(
    (doc) => doc.section.id === slugPath[0] && doc.slug === slugPath[1],
  );
  return {
    previous: index > 0 ? docs[index - 1] : undefined,
    next: index >= 0 && index < docs.length - 1 ? docs[index + 1] : undefined,
  };
}

export function getAllDocParams() {
  return getAllDocs().map((doc) => ({ slug: doc.slugPath }));
}

/**
 * One landing page per section, so /docs/guide and /docs/reference are real
 * pages. A static export cannot serve redirects, so the section roots are
 * generated instead.
 */
export function getSectionParams() {
  return sections.map((section) => ({ slug: [section.id] }));
}

export function getSection(sectionId: string) {
  return sections.find((section) => section.id === sectionId);
}

export function getSectionDocs(sectionId: string): DocPage[] {
  return getAllDocs().filter((doc) => doc.section.id === sectionId);
}
