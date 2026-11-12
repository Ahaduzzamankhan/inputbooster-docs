import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const root = process.cwd();
const contentDir = path.join(root, "content", "docs");
const outputFile = path.join(root, "public", "search-index.json");
const sections = JSON.parse(fs.readFileSync(path.join(root, "content", "sections.json"), "utf8"));

function walk(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return walk(full);
    return entry.name.endsWith(".mdx") ? [full] : [];
  });
}

function stripMarkdown(value) {
  return value
    .replace(/^\s*import\s.+$/gm, " ")
    .replace(/^\s*export\s.+$/gm, " ")
    .replace(/```[a-zA-Z0-9_-]*\n?/g, " ")
    .replace(/~~~/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, " ")
    .replace(/^\s*[-*+]\s+/gm, " ")
    .replace(/^\s*\d+\.\s+/gm, " ")
    .replace(/^\s*>\s?/gm, " ")
    .replace(/[`*~|]/g, " ")
    // Underscores are kept: they are part of every config key
    // (poll_rate_hz) and every class name (InputBoosterConfig).
    .replace(/&[a-z]+;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function headingsFor(source) {
  const slugger = new GithubSlugger();
  const headings = [];
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
    if (text) headings.push({ id: slugger.slug(text), text, depth: match[1].length });
  }
  return headings;
}

const records = walk(contentDir)
  .map((file) => {
    const relative = path.relative(contentDir, file).replace(/\\/g, "/");
    const [sectionId, ...rest] = relative.replace(/\.mdx$/, "").split("/");
    const section = sections.find((item) => item.id === sectionId);
    if (!section) return null;
    const slug = rest.join("/");
    const raw = fs.readFileSync(file, "utf8");
    const parsed = matter(raw);
    const text = stripMarkdown(parsed.content);
    return {
      title: parsed.data.title ?? slug,
      description: parsed.data.description ?? "",
      section: section.label,
      sectionId,
      href: `/docs/${sectionId}/${slug}`,
      headings: headingsFor(parsed.content),
      content: text,
      words: text ? text.split(/\s+/).length : 0,
      order: parsed.data.order ?? 999,
    };
  })
  .filter(Boolean)
  .sort((a, b) => {
    const sa = sections.find((s) => s.id === a.sectionId)?.order ?? 99;
    const sb = sections.find((s) => s.id === b.sectionId)?.order ?? 99;
    return sa - sb || a.order - b.order || a.title.localeCompare(b.title);
  });

fs.mkdirSync(path.dirname(outputFile), { recursive: true });
fs.writeFileSync(
  outputFile,
  JSON.stringify({ generatedAt: new Date().toISOString(), count: records.length, records }),
);
console.log(`Search index: ${records.length} pages -> public/search-index.json`);
