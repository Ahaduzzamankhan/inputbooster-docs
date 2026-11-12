import Link from "next/link";
import { ArrowLeft, FileQuestion } from "lucide-react";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-2xl flex-col items-start justify-center px-6 py-20">
      <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.12em] text-accent">
        <FileQuestion size={14} aria-hidden />
        404 / route not found
      </div>
      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-fog-50 sm:text-4xl">
        This page is not in the input path.
      </h1>
      <p className="mt-3 max-w-lg text-sm leading-relaxed text-fog-400">
        The documentation page you asked for does not exist, or it was renamed between
        releases. The full index is the fastest way back.
      </p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link
          href="/docs"
          className="inline-flex items-center gap-2 rounded-xs bg-accent px-3.5 py-2 text-[13px] font-semibold text-ink-950 hover:bg-accent-bright"
        >
          <ArrowLeft size={14} aria-hidden />
          Documentation index
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-xs border border-line-bright px-3.5 py-2 text-[13px] text-fog-200 hover:bg-ink-800"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
