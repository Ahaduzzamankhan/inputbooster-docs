import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from "rehype-slug";
import rehypePrettyCode from "rehype-pretty-code";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";
import { PrevNext } from "@/components/docs/prev-next";
import { ReadingProgress } from "@/components/docs/reading-progress";
import { SectionIndex } from "@/components/docs/section-index";
import { TableOfContents } from "@/components/docs/table-of-contents";
import { mdxComponents } from "@/components/mdx";
import {
  getAdjacentDocs,
  getAllDocParams,
  getDoc,
  getSection,
  getSectionDocs,
  getSectionParams,
  type DocPage,
} from "@/lib/docs";
import { site, ogImage } from "@/lib/site";

type PageProps = {
  params: Promise<{ slug: string[] }>;
};

export const dynamicParams = false;
export const dynamic = "force-static";

export function generateStaticParams() {
  // Every page, plus one landing page per section. A static export cannot
  // serve redirects, so /docs/guide and friends are real pages.
  return [...getAllDocParams(), ...getSectionParams()];
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;

  if (slug.length === 1) {
    const section = getSection(slug[0]);
    if (!section) return {};
    const url = `/docs/${section.id}`;
    return {
      title: section.label,
      description: section.description,
      alternates: { canonical: url },
      openGraph: {
        type: "website",
        title: `${section.label} — ${site.name} Documentation`,
        description: section.description,
        url,
        siteName: `${site.name} Documentation`,
        images: [{ url: ogImage, width: 1200, height: 630, alt: section.label }],
      },
      twitter: {
        card: "summary_large_image",
        title: section.label,
        description: section.description,
        images: [ogImage],
      },
    };
  }

  const doc = getDoc(slug);
  if (!doc) return {};
  const url = doc.href;
  return {
    title: doc.title,
    description: doc.description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: doc.title,
      description: doc.description,
      url,
      siteName: `${site.name} Documentation`,
      modifiedTime: doc.updated,
      images: [{ url: ogImage, width: 1200, height: 630, alt: doc.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: doc.title,
      description: doc.description,
      images: [ogImage],
    },
  };
}

function JsonLd({ doc }: { doc: DocPage }) {
  const data = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "TechArticle",
        headline: doc.title,
        description: doc.description,
        url: `${site.url}${doc.href}`,
        author: { "@type": "Person", name: site.author },
        publisher: { "@type": "Organization", name: site.name },
        about: "InputBooster Minecraft client mod",
        inLanguage: "en",
        ...(doc.updated ? { dateModified: doc.updated } : {}),
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site.url },
          {
            "@type": "ListItem",
            position: 2,
            name: doc.section.label,
            item: `${site.url}/docs/${doc.section.id}/${doc.slug}`,
          },
          { "@type": "ListItem", position: 3, name: doc.title },
        ],
      },
    ],
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }}
    />
  );
}

export default async function DocPage({ params }: PageProps) {
  const { slug } = await params;

  if (slug.length === 1) {
    const section = getSection(slug[0]);
    if (!section) notFound();
    return <SectionIndex section={section} />;
  }

  const doc = getDoc(slug);
  if (!doc) notFound();

  const { previous, next } = getAdjacentDocs(slug);
  const content = await MDXRemote({
    source: doc.content,
    components: mdxComponents,
    options: {
      parseFrontmatter: false,
      // The MDX is authored in this repository and is trusted, so JSX
      // attribute expressions have to stay: <Mermaid chart={...} />,
      // <FileTree items={[...]} /> and <CodeBlock code={...} /> all pass
      // their payload that way. The dangerous-call filter stays on so an
      // expression cannot reach eval, Function or process.
      blockJS: false,
      blockDangerousJS: true,
      mdxOptions: {
        remarkPlugins: [remarkGfm],
        rehypePlugins: [
          rehypeSlug,
          [
            rehypePrettyCode,
            {
              theme: "github-dark-default",
              keepBackground: false,
              defaultLang: "text",
            },
          ],
        ],
      },
    },
  });

  return (
    <>
      <ReadingProgress />
      <JsonLd doc={doc} />
      <div
        id="top"
        className="px-4 pb-16 pt-8 sm:px-8 lg:px-10 xl:grid xl:grid-cols-[minmax(0,1fr)_196px] xl:gap-10 xl:px-12"
      >
        <article className="min-w-0">
          <Breadcrumbs
            items={[{ label: doc.section.label }, { label: doc.title }]}
          />

          <header className="max-w-[46rem]">
            <div className="flex flex-wrap items-center gap-2">
              <span className="eyebrow">{doc.section.label}</span>
              {doc.group ? (
                <>
                  <span className="text-fog-500" aria-hidden>
                    /
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-[0.08em] text-fog-500">
                    {doc.group}
                  </span>
                </>
              ) : null}
              {doc.badge ? (
                <span className="rounded-xs border border-accent/25 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-accent">
                  {doc.badge}
                </span>
              ) : null}
            </div>
            <h1 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-fog-50 sm:text-[2.55rem]">
              {doc.title}
            </h1>
            <p className="mt-4 max-w-[42rem] text-[15px] leading-relaxed text-fog-300">
              {doc.description}
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line pb-5 font-mono text-[10px] uppercase tracking-[0.07em] text-fog-500">
              <span>{doc.readingMinutes} min read</span>
              <span className="h-3 w-px bg-line-bright" aria-hidden />
              <span>InputBooster {site.version}</span>
              <span className="h-3 w-px bg-line-bright" aria-hidden />
              <span>Minecraft {site.minecraft}</span>
              {doc.updated ? (
                <>
                  <span className="h-3 w-px bg-line-bright" aria-hidden />
                  <span>Updated {doc.updated}</span>
                </>
              ) : null}
            </div>
          </header>

          <div className="prose-docs mt-8">
            {content}
          </div>

          <PrevNext previous={previous} next={next} />
        </article>

        <aside className="mt-10 hidden min-w-0 xl:block xl:mt-0">
          <TableOfContents headings={doc.headings} />
        </aside>
      </div>
    </>
  );
}
