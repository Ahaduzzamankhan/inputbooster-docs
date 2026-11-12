import Link from "next/link";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { DocPage } from "@/lib/docs";

export function PrevNext({
  previous,
  next,
}: {
  previous?: DocPage;
  next?: DocPage;
}) {
  if (!previous && !next) return null;
  return (
    <nav aria-label="Page navigation" className="mt-14 grid gap-3 border-t border-line pt-6 sm:grid-cols-2">
      {previous ? (
        <Link
          href={previous.href}
          className="group flex flex-col gap-1 rounded-sm border border-line bg-ink-900/60 p-4 transition-colors hover:border-line-bright hover:bg-ink-900"
        >
          <span className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fog-500">
            <ArrowLeft size={11} aria-hidden /> Previous
          </span>
          <span className="text-sm font-medium text-fog-200 group-hover:text-fog-50">
            {previous.title}
          </span>
          <span className="text-[11px] text-fog-500">{previous.section.label}</span>
        </Link>
      ) : (
        <span className="hidden sm:block" />
      )}
      {next ? (
        <Link
          href={next.href}
          className="group flex flex-col gap-1 rounded-sm border border-line bg-ink-900/60 p-4 text-right transition-colors hover:border-line-bright hover:bg-ink-900 sm:col-start-2"
        >
          <span className="inline-flex items-center justify-end gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fog-500">
            Next <ArrowRight size={11} aria-hidden />
          </span>
          <span className="text-sm font-medium text-fog-200 group-hover:text-fog-50">{next.title}</span>
          <span className="text-[11px] text-fog-500">{next.section.label}</span>
        </Link>
      ) : null}
    </nav>
  );
}
