"use client";

import { useRef, type ComponentPropsWithoutRef } from "react";
import { CopyButton } from "@/components/ui/copy-button";

type CodeShellProps = {
  children?: React.ReactNode;
  html?: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
};

export function CodeShell({ children, html, language, title, showLineNumbers }: CodeShellProps) {
  const preRef = useRef<HTMLPreElement>(null);
  const label = title ?? language ?? "code";

  return (
    <div className="code-shell">
      <div className="code-shell-head">
        <span className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-fog-400">
          {label}
        </span>
        <CopyButton getText={() => preRef.current?.innerText ?? ""} />
      </div>
      {html ? (
        <div
          ref={preRef as unknown as React.RefObject<HTMLDivElement>}
          className={showLineNumbers ? "code-html line-numbers" : "code-html"}
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <pre ref={preRef}>{children}</pre>
      )}
    </div>
  );
}

export function CodeFence(props: ComponentPropsWithoutRef<"pre">) {
  const { children, ...rest } = props;
  const raw = rest as Record<string, unknown>;
  const language = typeof raw["data-language"] === "string" ? (raw["data-language"] as string) : undefined;
  return (
    <CodeShell language={language}>
      <pre {...rest}>{children}</pre>
    </CodeShell>
  );
}
