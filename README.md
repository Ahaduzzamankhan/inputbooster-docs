# InputBooster Documentation

Source-verified documentation for **InputBooster**, a client-side Minecraft mod
that samples keyboard and mouse input faster than the game tick does.

- Mod: [Ahaduzzamankhan/inputbooster](https://github.com/Ahaduzzamankhan/inputbooster)
- Mod version documented here: **4.1.2-alpha** (Minecraft 26.2 / 26.3, Java 25)
- Live site: <https://ahaduzzamankhan.github.io/inputbooster-docs>

Every behavioural claim on the site is tied to the `4.1.2-alpha` source tree.
Settings that are persisted but have no runtime effect are documented as such
rather than quietly presented as working features.

## Stack

| Part | Choice |
| --- | --- |
| Framework | Next.js 16 (App Router), static export |
| Language | TypeScript, strict |
| Content | MDX via `next-mdx-remote`, compiled at build time |
| Styling | Tailwind CSS 4, dark only |
| Animation | Motion (`motion/react`), honours `prefers-reduced-motion` |
| Icons | Lucide React |
| Search | Custom build-time index, fetched on demand |
| Hosting | GitHub Pages, deployed by GitHub Actions |

## Local development

```bash
npm install
npm run dev          # http://localhost:3000
```

Other commands:

| Command | What it does |
| --- | --- |
| `npm run build` | Rebuilds the search index, exports the site to `out/`, copies the OG image |
| `npm run serve` | Serves `out/` the way GitHub Pages would |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run search:index` | Regenerates `public/search-index.json` |
| `npm run validate:links` | Checks every internal link and anchor |
| `npm run check:nesting` | Checks the built HTML for invalid nesting that breaks hydration |

To preview the export exactly as it is deployed, including the base path:

```bash
npm run build
npm run serve -- --port 4000 --base /inputbooster-docs
```

## Writing content

Pages live in `content/docs/<section>/<slug>.mdx`. The section registry is
`content/sections.json`.

```mdx
---
title: "Requirements"
description: "The exact loader, Java and Minecraft versions InputBooster supports."
order: 2
group: "Start here"
---

Body copy. Use `##` and `###` for headings.
```

Frontmatter fields: `title` and `description` are required; `order`, `group`,
`badge` and `updated` are optional.

### Available components

`<Callout>`, `<Tabs>` / `<Tab>`, `<Steps>` / `<Step>`, `<CodeBlock>`,
`<FileTree>`, `<FileRef>`, `<Badge>`, `<VideoEmbed>`, `<Command>`,
`<Mermaid>`, `<Kbd>` and `<Lead>`.

```mdx
<Callout variant="warning" title="Alpha build">
  This is the alpha line.
</Callout>

<CodeBlock language="java" title="InputDrainer.java" code={`public static void drainAll() {}`} />
```

## Deployment

The site is a static export, because GitHub Pages has no server runtime.

`.github/workflows/deploy-pages.yml` builds and publishes it on every push to
`main`, and runs the build as a check on pull requests. The base path
(`/inputbooster-docs`) is injected at build time, so the same source works on
a different host by changing `NEXT_PUBLIC_BASE_PATH`.

## Licence

MIT. See [LICENSE](./LICENSE).

InputBooster is not affiliated with Mojang Studios or Microsoft.
