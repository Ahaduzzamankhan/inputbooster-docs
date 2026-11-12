"use client";

import { CopyButton } from "@/components/ui/copy-button";

export function Command({
  command,
  prompt = "$",
  block = false,
  label,
}: {
  command: string;
  prompt?: string;
  block?: boolean;
  label?: string;
}) {
  if (block) {
    return (
      <div className="code-shell">
        <div className="code-shell-head">
          <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-fog-400">
            {label ?? "Command"}
          </span>
          <CopyButton text={command} />
        </div>
        <pre>
          <code>
            <span className="select-none text-accent">{prompt} </span>
            <span className="text-fog-100">{command}</span>
          </code>
        </pre>
      </div>
    );
  }

  return (
    <span className="inline-flex max-w-full items-center gap-1.5 rounded-xs border border-line bg-ink-800 px-1.5 py-0.5 align-middle">
      <span className="font-mono text-[0.72rem] text-accent" aria-hidden>
        {prompt}
      </span>
      <code className="overflow-x-auto whitespace-nowrap font-mono text-[0.74rem] text-fog-100">
        {command}
      </code>
      <CopyButton text={command} label="" className="px-1 py-0" />
    </span>
  );
}
