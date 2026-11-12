/**
 * Validates every internal link in the documentation.
 *
 * Checks, in order:
 *   1. every /docs/... link in the MDX content points at a real page,
 *   2. every anchor (#fragment) points at a heading that exists on the page,
 *   3. every link used by the site code points at a real route,
 *   4. every published page is reachable from the navigation,
 *   5. the sitemap and the search index agree with the page list.
 *
 * Run with: npm run validate:links
 */
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import GithubSlugger from "github-slugger";

const ROOT = process.cwd();
const CONTENT_DIR = path.join(ROOT, "content", "docs");
const SECTIONS = JSON.parse(
  fs.readFileSync(path.join(ROOT, "content", "sections.json"), "utf8"),
);

const errors = [];
const warnings = [];

function fail(message) {
  errors.push(message);
}

function warn(message) {
  warnings.push(message);
}

/** Collect the MDX files and their metadata. */
function loadDocs() {
  const docs = [];
  for (const section of SECTIONS) {
    const dir = path.join(CONTENT_DIR, section.id);
    if (!fs.existsSync(dir)) {
      fail(`Section directory missing for "${section.id}"`);
      continue;
    }
    for (const file of fs.readdirSync(dir)) {
      if (!file.endsWith(".mdx")) continue;
      const full = path.join(dir, file);
      const raw = fs.readFileSync(full, "utf8");
      const parsed = matter(raw);
      const data = parsed.data ?? {};
      if (!data.title) fail(`${section.id}/${file}: missing "title" in frontmatter`);
      if (!data.description) fail(`${section.id}/${file}: missing "description" in frontmatter`);
      const slug = file.replace(/\.mdx$/, "");
      docs.push({
        section: section.id,
        slug,
        href: `/docs/${section.id}/${slug}`,
        file: path.relative(ROOT, full).replace(/\\/g, "/"),
        content: parsed.content,
        headings: extractHeadings(parsed.content),
      });
    }
  }
  return docs;
}

function stripMarkdown(value) {
  return value
    .replace(/[`*_~]/g, "")
    .replace(/&[a-z]+;/gi, "")
    .trim();
}

/** Mirrors the heading extraction in lib/docs.ts so the ids match the TOC. */
function extractHeadings(source) {
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
    if (!text) continue;
    headings.push({ id: slugger.slug(text), text });
  }
  return headings;
}

/** Pull every markdown and JSX link target out of the MDX body. */
function extractLinks(content) {
  const links = [];
  const withoutFences = content.replace(/```[\s\S]*?```/g, "\n").replace(/~~~[\s\S]*?~~~/g, "\n");
  const patterns = [
    /\[[^\]]*\]\(([^)\s]+)(?:\s+"[^"]*")?\)/g, // [text](href)
    /href=(?:"([^"]*)"|'([^']*)')/g, // href="..."
  ];
  for (const pattern of patterns) {
    let match;
    while ((match = pattern.exec(withoutFences)) !== null) {
      links.push(match[1] ?? match[2] ?? "");
    }
  }
  return links.filter(Boolean);
}

/** Pull the links out of the site code. */
function extractCodeLinks() {
  const links = [];
  const roots = ["app", "components", "lib"];
  const files = [];
  const walk = (dir) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) walk(full);
      else if (/\.(tsx|ts)$/.test(entry.name)) files.push(full);
    }
  };
  for (const root of roots) walk(path.join(ROOT, root));

  for (const file of files) {
    const source = fs.readFileSync(file, "utf8");
    // Plain string literals only: a template literal such as
    // `/docs/${section.id}/${slug}` is a pattern, not a link.
    const pattern = /["'](\/docs\/[^"'\s]*)["']/g;
    let match;
    while ((match = pattern.exec(source)) !== null) {
      links.push({ href: match[1], file: path.relative(ROOT, file).replace(/\\/g, "/") });
    }
  }
  return links;
}

const docs = loadDocs();
const byHref = new Map(docs.map((doc) => [doc.href, doc]));
const allHrefs = new Set(byHref.keys());

// 1 + 2. Content links and anchors.
for (const doc of docs) {
  const links = extractLinks(doc.content);
  for (const link of links) {
    if (/^(https?:|mailto:|tel:)/i.test(link)) continue;

    if (link.startsWith("#")) {
      const id = decodeURIComponent(link.slice(1));
      if (!doc.headings.some((heading) => heading.id === id)) {
        fail(`${doc.file}: anchor "${link}" does not match a heading on this page`);
      }
      continue;
    }

    if (!link.startsWith("/")) {
      warn(`${doc.file}: relative link "${link}" is not supported`);
      continue;
    }

    const [pathname, fragment] = link.split("#");
    if (pathname === "/docs" || pathname === "/docs/") continue;

    const target = byHref.get(pathname);
    if (!target) {
      fail(`${doc.file}: link to "${pathname}" has no matching page`);
      continue;
    }
    if (fragment) {
      const id = decodeURIComponent(fragment);
      if (!target.headings.some((heading) => heading.id === id)) {
        fail(`${doc.file}: link to "${pathname}#${id}" has no matching heading`);
      }
    }
  }
}

// 3. Code links.
for (const { href, file } of extractCodeLinks()) {
  const [pathname, fragment] = href.split("#");
  const target = byHref.get(pathname);
  if (!target) {
    fail(`${file}: link to "${pathname}" has no matching page`);
    continue;
  }
  if (fragment) {
    const id = decodeURIComponent(fragment);
    if (!target.headings.some((heading) => heading.id === id)) {
      fail(`${file}: link to "${pathname}#${id}" has no matching heading`);
    }
  }
}

// 4. Every page is reachable from the navigation.
for (const section of SECTIONS) {
  const sectionDocs = docs.filter((doc) => doc.section === section.id);
  if (sectionDocs.length === 0) {
    fail(`Section "${section.id}" has no pages`);
    continue;
  }
  for (const doc of sectionDocs) {
    const source = fs.readFileSync(path.join(ROOT, doc.file), "utf8");
    const parsed = matter(source);
    const group = parsed.data?.group;
    if (!group) {
      warn(`${doc.file}: no "group" in frontmatter, the sidebar will show it ungrouped`);
    }
  }
}

// 5. The search index and the sitemap agree with the page list.
const indexPath = path.join(ROOT, "public", "search-index.json");
if (!fs.existsSync(indexPath)) {
  fail("public/search-index.json is missing. Run npm run search:index");
} else {
  const index = JSON.parse(fs.readFileSync(indexPath, "utf8"));
  const entries = Array.isArray(index) ? index : index.records ?? index.pages ?? index.entries ?? [];
  if (Array.isArray(entries)) {
    for (const entry of entries) {
      const href = entry.href ?? entry.url ?? entry.path;
      if (href && !allHrefs.has(href)) {
        fail(`search-index.json points at "${href}", which is not a page`);
      }
    }
    if (entries.length !== docs.length) {
      fail(`search-index.json has ${entries.length} entries, expected ${docs.length}`);
    }
  } else {
    fail("search-index.json has an unexpected shape");
  }
}

const sitemapPath = path.join(ROOT, "app", "sitemap.ts");
if (!fs.existsSync(sitemapPath)) {
  fail("app/sitemap.ts is missing");
}

// Report.
console.log(`Checked ${docs.length} pages across ${SECTIONS.length} sections.`);

if (warnings.length > 0) {
  console.log(`\n${warnings.length} warning(s):`);
  for (const message of warnings) console.log(`  warn  ${message}`);
}

if (errors.length > 0) {
  console.error(`\n${errors.length} error(s):`);
  for (const message of errors) console.error(`  FAIL  ${message}`);
  process.exit(1);
}

console.log("\nAll internal links and anchors resolve.");
