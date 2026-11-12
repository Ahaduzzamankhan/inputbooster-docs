/**
 * Checks the built HTML for invalid nesting that breaks hydration.
 *
 * A block element inside a paragraph is invalid HTML: the browser closes the
 * paragraph while parsing, so the DOM the client hydrates differs from the
 * HTML the server sent. React reports that as a hydration error.
 *
 * Run after a build: node scripts/check-nesting.mjs
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");

/** Elements that implicitly close an open <p>. */
const CLOSES_P = new Set([
  "ADDRESS", "ARTICLE", "ASIDE", "BLOCKQUOTE", "DETAILS", "DIV", "DL", "FIELDSET",
  "FIGCAPTION", "FIGURE", "FOOTER", "FORM", "H1", "H2", "H3", "H4", "H5", "H6",
  "HEADER", "HGROUP", "HR", "MAIN", "MENU", "NAV", "OL", "P", "PRE", "SECTION",
  "TABLE", "UL",
]);

const VOID = new Set([
  "AREA", "BASE", "BR", "COL", "EMBED", "HR", "IMG", "INPUT", "LINK", "META",
  "PARAM", "SOURCE", "TRACK", "WBR",
]);

/** Elements whose content is not markup. */
const RAW_TEXT = new Set(["SCRIPT", "STYLE"]);

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else if (entry.name.endsWith(".html")) files.push(full);
  }
  return files;
}

/** A small HTML scanner: enough to track the open element stack. */
function scan(html) {
  const problems = [];
  const stack = [];
  const tagPattern = /<(\/?)([a-zA-Z][a-zA-Z0-9-]*)([^>]*?)(\/?)>/g;
  let match;

  while ((match = tagPattern.exec(html)) !== null) {
    const [, closing, rawName, , selfClosing] = match;
    const name = rawName.toUpperCase();

    if (VOID.has(name) || selfClosing === "/") continue;

    if (closing) {
      const index = stack.map((entry) => entry.name).lastIndexOf(name);
      if (index === -1) continue; // stray closing tag, the browser ignores it
      // Everything above the match is implicitly closed by the browser.
      for (let i = stack.length - 1; i > index; i--) {
        const entry = stack[i];
        if (entry.name === "P") {
          problems.push(`<p> implicitly closed by </${name}> at offset ${match.index}`);
        }
      }
      stack.length = index;
      continue;
    }

    const top = stack[stack.length - 1];
    if (top?.name === "P" && CLOSES_P.has(name)) {
      problems.push(`<${name}> inside <p> at offset ${match.index}`);
    }
    if (name === "P" && stack.some((entry) => entry.name === "P")) {
      problems.push(`<p> nested inside <p> at offset ${match.index}`);
    }

    stack.push({ name, offset: match.index });

    if (RAW_TEXT.has(name)) {
      // Skip the raw text content of the element.
      const end = html.toLowerCase().indexOf(`</${name.toLowerCase()}>`, tagPattern.lastIndex);
      if (end !== -1) {
        tagPattern.lastIndex = end;
        stack.pop();
      }
    }
  }

  return problems;
}

const files = walk(outDir);
let total = 0;

for (const file of files) {
  const html = fs.readFileSync(file, "utf8");
  const start = html.indexOf("<body");
  const end = html.indexOf("</body>");
  const body = start === -1 ? html : html.slice(start, end === -1 ? html.length : end);
  const problems = scan(body);
  if (problems.length > 0) {
    total += problems.length;
    console.log(`\n${path.relative(outDir, file)}:`);
    for (const problem of problems.slice(0, 6)) console.log(`  ${problem}`);
    if (problems.length > 6) console.log(`  ... and ${problems.length - 6} more`);
  }
}

console.log(`\nChecked ${files.length} HTML files.`);
if (total > 0) {
  console.error(`${total} invalid nesting problem(s) found.`);
  process.exit(1);
}
console.log("No invalid nesting found.");
