"use client";

import { useEffect, useId, useRef, useState } from "react";

export function Mermaid({ chart, caption }: { chart: string; caption?: string }) {
  const id = useId().replace(/:/g, "");
  const host = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const render = async () => {
      try {
        const mermaid = (await import("mermaid")).default;
        mermaid.initialize({
          startOnLoad: false,
          securityLevel: "strict",
          theme: "dark",
          fontFamily: "JetBrains Mono Variable, monospace",
          themeVariables: {
            background: "#0a0d11",
            primaryColor: "#11161d",
            primaryTextColor: "#e6edf3",
            primaryBorderColor: "#2b3642",
            lineColor: "#55d6e8",
            secondaryColor: "#0c1015",
            tertiaryColor: "#0c1015",
            noteBkgColor: "#11161d",
            noteTextColor: "#c7d2de",
            noteBorderColor: "#2b3642",
          },
        });
        const { svg } = await mermaid.render(`mermaid-${id}`, chart);
        if (!cancelled && host.current) {
          host.current.innerHTML = svg;
        }
      } catch (cause) {
        if (!cancelled) {
          setError(cause instanceof Error ? cause.message : "Diagram could not be rendered.");
        }
      }
    };
    void render();
    return () => {
      cancelled = true;
    };
  }, [chart, id]);

  return (
    <figure className="my-7 overflow-hidden rounded-sm border border-line bg-ink-900">
      <div className="overflow-x-auto p-4">
        {error ? (
          <pre className="whitespace-pre-wrap font-mono text-xs text-danger">
            Diagram error: {error}
          </pre>
        ) : (
          <div ref={host} className="mermaid-host flex min-h-24 items-center justify-center" />
        )}
      </div>
      {caption ? (
        <figcaption className="border-t border-line px-4 py-2 text-xs text-fog-400">
          {caption}
        </figcaption>
      ) : null}
    </figure>
  );
}
