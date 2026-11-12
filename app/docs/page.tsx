import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Terminal } from "lucide-react";
import { getNav } from "@/lib/docs";
import { site, ogImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Every InputBooster page: installation, the gamer guide, configuration keys, internals, troubleshooting and release history.",
  alternates: { canonical: "/docs" },
  openGraph: {
    type: "website",
    title: "InputBooster Documentation",
    description:
      "Every InputBooster page: installation, the gamer guide, configuration keys, internals, troubleshooting and release history.",
    url: "/docs",
    siteName: "InputBooster Documentation",
    images: [{ url: ogImage, width: 1200, height: 630, alt: "InputBooster Documentation" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "InputBooster Documentation",
    description:
      "Every InputBooster page: installation, the gamer guide, configuration keys, internals, troubleshooting and release history.",
    images: [ogImage],
  },
};

export default function DocsIndexPage() {
  const nav = getNav();
  const total = nav.reduce(
    (sum, section) => sum + section.groups.reduce((count, group) => count + group.items.length, 0),
    0,
  );

  return (
    <div className="px-4 pb-16 pt-10 sm:px-8 lg:px-10 xl:px-12">
      <div className="max-w-[52rem]">
        <div className="eyebrow">InputBooster documentation</div>
        <h1 className="mt-3 text-[2.1rem] font-semibold tracking-[-0.03em] text-fog-50 sm:text-[2.7rem]">
          Read the system, not a sales page.
        </h1>
        <p className="mt-4 max-w-[44rem] text-[15px] leading-relaxed text-fog-300">
          {total} pages covering the mod as it exists in the {site.version} source tree:
          what it does, every configuration key, how the input pipeline is built, and
          which parts are still unverified. Start with the overview if this is your first
          session.
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          <Link
            href="/docs/getting-started/overview"
            className="inline-flex items-center gap-2 rounded-xs bg-accent px-3.5 py-2 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-accent-bright"
          >
            <BookOpen size={15} aria-hidden />
            Start with the overview
          </Link>
          <Link
            href="/docs/configuration/config-file"
            className="inline-flex items-center gap-2 rounded-xs border border-line-bright px-3.5 py-2 text-[13px] text-fog-200 transition-colors hover:bg-ink-800"
          >
            <Terminal size={15} aria-hidden />
            Configuration reference
          </Link>
        </div>
      </div>

      <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {nav.map((section) => {
          const items = section.groups.flatMap((group) => group.items);
          return (
            <section
              key={section.id}
              className="group flex flex-col rounded-sm border border-line bg-ink-900/50 p-4 transition-colors hover:border-line-bright hover:bg-ink-900"
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-semibold tracking-[-0.01em] text-fog-100">
                  {section.label}
                </h2>
                <span className="font-mono text-[10px] text-fog-500">
                  {String(section.order).padStart(2, "0")}
                </span>
              </div>
              <p className="mt-1.5 text-[11.5px] leading-relaxed text-fog-400">
                {section.description}
              </p>
              <ul className="mt-3 space-y-1 border-t border-line/70 pt-2.5">
                {items.slice(0, 4).map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="flex items-center gap-1.5 py-0.5 text-[12px] text-fog-300 hover:text-accent"
                    >
                      <ArrowRight
                        size={10}
                        className="shrink-0 text-fog-500 group-hover:text-accent/70"
                        aria-hidden
                      />
                      {item.title}
                    </Link>
                  </li>
                ))}
                {items.length > 4 ? (
                  <li className="pt-1 font-mono text-[10px] text-fog-500">
                    +{items.length - 4} more in this section
                  </li>
                ) : null}
              </ul>
            </section>
          );
        })}
      </div>
    </div>
  );
}
