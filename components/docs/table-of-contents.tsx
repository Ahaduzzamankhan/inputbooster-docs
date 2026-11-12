"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/docs";

export function TableOfContents({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string>(headings[0]?.id ?? "");

  useEffect(() => {
    if (headings.length === 0) return;
    let frame = 0;

    const update = () => {
      frame = 0;
      let current = headings[0]?.id ?? "";
      for (const heading of headings) {
        const element = document.getElementById(heading.id);
        if (!element) continue;
        if (element.getBoundingClientRect().top <= 130) current = heading.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <>
      <details className="mb-8 rounded-sm border border-line bg-ink-900 xl:hidden">
        <summary className="cursor-pointer px-3 py-2.5 font-mono text-[10px] uppercase tracking-[0.1em] text-fog-300">
          On this page
        </summary>
        <nav aria-label="On this page" className="border-t border-line px-3 py-2">
          <ul className="space-y-1.5 text-xs">
            {headings.map((heading) => (
              <li key={heading.id} className={heading.depth === 3 ? "pl-3" : ""}>
                <a
                  href={`#${heading.id}`}
                  className={
                    active === heading.id
                      ? "text-accent"
                      : "text-fog-400 hover:text-fog-100"
                  }
                >
                  {heading.text}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </details>

      <div className="hidden xl:block">
        <nav aria-label="On this page" className="sticky top-24">
          <div className="eyebrow">On this page</div>
          <ul className="mt-3 space-y-1 border-l border-line">
            {headings.map((heading) => {
              const isActive = active === heading.id;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    aria-current={isActive ? "location" : undefined}
                    className={`-ml-px block border-l py-1 text-[11.5px] leading-snug transition-colors ${
                      heading.depth === 3 ? "pl-5" : "pl-3"
                    } ${
                      isActive
                        ? "border-accent font-medium text-accent"
                        : "border-transparent text-fog-500 hover:border-line-bright hover:text-fog-200"
                    }`}
                  >
                    {heading.text}
                  </a>
                </li>
              );
            })}
          </ul>
          <a
            href="#top"
            className="mt-5 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-[0.08em] text-fog-500 hover:text-accent"
          >
            Back to top ↑
          </a>
        </nav>
      </div>
    </>
  );
}
