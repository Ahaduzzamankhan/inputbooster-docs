/**
 * Serves the static export in `out/` the way GitHub Pages would.
 *
 * GitHub Pages serves a directory request from its index.html, maps
 * /foo/ to /foo/index.html, and serves /404.html for a path that does not
 * exist. This server does the same, so the exported site can be checked
 * locally before it is deployed.
 *
 * Usage: npm run serve -- --port 4000 --base /inputbooster-docs
 */
import fs from "node:fs";
import http from "node:http";
import path from "node:path";

const args = process.argv.slice(2);
function arg(name, fallback) {
  const index = args.indexOf(`--${name}`);
  if (index === -1 || index + 1 >= args.length) return fallback;
  return args[index + 1];
}

const port = Number(arg("port", process.env.PORT ?? "4000"));
const base = (arg("base", process.env.NEXT_PUBLIC_BASE_PATH ?? "") ?? "").replace(/\/$/, "");
const root = path.join(process.cwd(), "out");

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".map": "application/json; charset=utf-8",
};

function send(res, file, status = 200) {
  const type = types[path.extname(file).toLowerCase()] ?? "application/octet-stream";
  res.writeHead(status, { "content-type": type });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer((req, res) => {
  let pathname = decodeURIComponent((req.url ?? "/").split("?")[0]);

  if (base && pathname.startsWith(base)) pathname = pathname.slice(base.length) || "/";
  else if (base) {
    res.writeHead(302, { location: `${base}${pathname}` });
    res.end();
    return;
  }

  // Block traversal.
  const target = path.normalize(path.join(root, pathname));
  if (!target.startsWith(root)) {
    res.writeHead(403).end("Forbidden");
    return;
  }

  if (fs.existsSync(target) && fs.statSync(target).isDirectory()) {
    const index = path.join(target, "index.html");
    if (fs.existsSync(index)) {
      send(res, index);
      return;
    }
  }

  if (fs.existsSync(target) && fs.statSync(target).isFile()) {
    send(res, target);
    return;
  }

  const notFound = path.join(root, "404.html");
  if (fs.existsSync(notFound)) {
    send(res, notFound, 404);
    return;
  }
  res.writeHead(404).end("Not found");
});

server.listen(port, () => {
  console.log(`Serving ${root} at http://localhost:${port}${base}`);
});
