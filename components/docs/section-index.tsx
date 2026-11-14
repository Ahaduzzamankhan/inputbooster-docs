import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getSectionDocs, type DocPage } from "@/lib/docs";
import type { Section } from "@/lib/sections";
import { Breadcrumbs } from "@/components/docs/breadcrumbs";

/**
 * The landing page of a documentation section, for example /docs/guide.
 *
 * A static export cannot serve redirects, so the section roots are generated
 * as real pages that list the pages they contain.
 */
export function SectionIndex({ section }: { section: Section }) {
  const docs = getSectionDocs(section.id);

  const groups = new Map<string | null, DocPage[]>();
  for (const doc of docs) {
    const key = doc.group ?? null;
    const list = groups.get(key) ?? [];
    list.push(doc);
    groups.set(key, list);
  }

  const ordered = [...groups.entries()].sort((a, b) => {
    if (a[0] === null) return -1;
    if (b[0] === null) return 1;
    const minA = Math.min(...a[1].map((doc) => doc.order));
    const minB = Math.min(...b[1].map((doc) => doc.order));
    return minA - minB;
  });

  return (
    <div className="px-4 pb-16 pt-8 sm:px-8 lg:px-10 xl:px-12">
      <div className="max-w-[52rem]">
        <Breadcrumbs items={[{ label: section.label }]} />

        <div className="mt-4">
          <span className="eyebrow">InputBooster documentation</span>
          <h1 className="mt-3 text-[2rem] font-semibold leading-[1.12] tracking-[-0.03em] text-fog-50 sm:text-[2.55rem]">
            {section.label}
          </h1>
          <p className="mt-4 max-w-[42rem] text-[15px] leading-relaxed text-fog-300">
            {section.description}
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-1.5 border-b border-line pb-5 font-mono text-[10px] uppercase tracking-[0.07em] text-fog-500">
            <span>{docs.length} pages</span>
            <span className="h-3 w-px bg-line-bright" aria-hidden />
            <span>InputBooster 4.1.2-beta3</span>
          </div>
        </div>

        <div className="mt-10 space-y-10">
          {ordered.map(([group, items]) => (
            <section key={group ?? "general"}>
              {group ? (
                <h2 className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog-500">
                  {group}
                </h2>
              ) : null}
              <ul className="mt-3 grid gap-3 sm:grid-cols-2">
                {items.map((doc) => (
                  <li key={doc.href}>
                    <Link
                      href={doc.href}
                      className="group flex h-full flex-col rounded-sm border border-line bg-ink-900/50 p-3.5 transition-colors hover:border-line-bright hover:bg-ink-900"
                    >
                      <span className="flex items-center gap-2">
                        <span className="text-[13.5px] font-medium text-fog-100">
                          {doc.title}
                        </span>
                        {doc.badge ? (
                          <span className="rounded-xs border border-accent/25 bg-accent/10 px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.08em] text-accent">
                            {doc.badge}
                          </span>
                        ) : null}
                      </span>
                      <span className="mt-1.5 block text-[12px] leading-relaxed text-fog-400">
                        {doc.description}
                      </span>
                      <span className="mt-3 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fog-500 transition-colors group-hover:text-accent">
                        Read
                        <ArrowRight size={10} aria-hidden />
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
