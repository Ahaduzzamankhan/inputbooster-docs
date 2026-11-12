/**
 * Copies the generated Open Graph image to a path with a .png extension.
 *
 * Next writes the image produced by app/opengraph-image.tsx to
 * `out/opengraph-image`, a file with no extension. GitHub Pages would serve
 * that as application/octet-stream, which some social crawlers reject. The
 * metadata points at /og.png, so the file is copied under that name.
 */
import fs from "node:fs";
import path from "node:path";

const outDir = path.join(process.cwd(), "out");
const source = path.join(outDir, "opengraph-image");
const target = path.join(outDir, "og.png");

if (!fs.existsSync(source)) {
  console.error("og-image copy skipped: out/opengraph-image was not produced.");
  process.exit(1);
}

fs.copyFileSync(source, target);
console.log(`Open Graph image -> out/og.png (${fs.statSync(target).size} bytes)`);
