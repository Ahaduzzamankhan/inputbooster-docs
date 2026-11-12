import { FileCode2 } from "lucide-react";

export function FileRef({ path, line }: { path: string; line?: number | string }) {
  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-xs border border-line bg-ink-800 px-2 py-0.5 align-middle font-mono text-[0.72rem] text-fog-300">
      <FileCode2 size={12} className="shrink-0 text-fog-500" aria-hidden />
      <span className="truncate">{path}</span>
      {line ? <span className="shrink-0 text-accent">:{line}</span> : null}
    </span>
  );
}
