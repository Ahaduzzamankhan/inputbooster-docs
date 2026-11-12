"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, FileText, Loader2, Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  useCallback,
  useDeferredValue,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  highlight,
  searchIndex,
  type SearchIndex,
  type SearchResult,
} from "@/lib/search";
import { withBasePath } from "@/lib/site";

export function SearchDialog({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const reduceMotion = useReducedMotion();
  const inputRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState("");
  const deferred = useDeferredValue(query);
  const [index, setIndex] = useState<SearchIndex | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [active, setActive] = useState(0);
  const [reloadKey, setReloadKey] = useState(0);

  const results = useMemo<SearchResult[]>(
    () => (index ? searchIndex(index, deferred) : []),
    [deferred, index],
  );

  const loadIndex = useCallback(() => {
    setStatus("loading");
    fetch(withBasePath("/search-index.json"))
      .then((response) => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json() as Promise<SearchIndex>;
      })
      .then((data) => {
        setIndex(data);
        setStatus("ready");
      })
      .catch(() => setStatus("error"));
  }, []);

  useEffect(() => {
    if (!open) return;
    setActive(0);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => inputRef.current?.focus(), 30);
    return () => {
      document.body.style.overflow = previous;
      window.clearTimeout(focusTimer);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    if (status === "error") return;
    if (status === "idle") loadIndex();
  }, [loadIndex, open, reloadKey, status]);

  useEffect(() => {
    setActive(0);
  }, [deferred]);

  const go = useCallback(
    (href: string) => {
      onClose();
      router.push(href);
    },
    [onClose, router],
  );

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      event.preventDefault();
      onClose();
      return;
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, Math.max(0, results.length - 1)));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(0, current - 1));
      return;
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active].href);
      return;
    }
    if (event.key === "Tab") {
      const focusables = panelRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], input, [tabindex]:not([tabindex="-1"])',
      );
      if (!focusables || focusables.length === 0) return;
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }
  };

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          className="fixed inset-0 z-[80] flex items-start justify-center px-4 pt-[8vh] sm:pt-[12vh]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.16 }}
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) onClose();
          }}
        >
          <div className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm" aria-hidden />
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="search-title"
            onKeyDown={onKeyDown}
            initial={reduceMotion ? false : { opacity: 0, y: -10, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6, scale: 0.995 }}
            transition={{ duration: reduceMotion ? 0 : 0.18, ease: [0.22, 1, 0.36, 1] }}
            className="relative w-full max-w-2xl overflow-hidden rounded-sm border border-line-bright bg-ink-900 shadow-2xl shadow-black/60"
          >
            <h2 id="search-title" className="sr-only">
              Search the documentation
            </h2>
            <div className="flex items-center gap-3 border-b border-line px-4 py-3">
              <Search size={17} className="shrink-0 text-fog-500" aria-hidden />
              <input
                ref={inputRef}
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search pages, config keys, classes…"
                aria-label="Search query"
                autoComplete="off"
                spellCheck={false}
                className="min-w-0 flex-1 bg-transparent text-[15px] text-fog-50 outline-none placeholder:text-fog-500"
              />
              {query ? (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  aria-label="Clear search"
                  className="rounded-xs p-1 text-fog-400 hover:bg-ink-700 hover:text-fog-100"
                >
                  <X size={14} aria-hidden />
                </button>
              ) : null}
              <button
                type="button"
                onClick={onClose}
                className="hidden rounded-xs border border-line px-2 py-1 font-mono text-[10px] text-fog-400 sm:block"
                aria-label="Close search"
              >
                ESC
              </button>
            </div>

            <div className="max-h-[56vh] min-h-[10rem] overflow-y-auto overscroll-contain">
              {status === "loading" ? (
                <div className="flex items-center gap-2 px-5 py-8 text-sm text-fog-400">
                  <Loader2 size={15} className="animate-spin text-accent" aria-hidden />
                  Loading the search index…
                </div>
              ) : status === "error" ? (
                <div className="px-5 py-8">
                  <p className="text-sm text-fog-200">The search index could not be loaded.</p>
                  <p className="mt-1 text-xs text-fog-400">
                    Run <code className="font-mono text-accent">npm run search:index</code> and reload.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setStatus("idle");
                      setReloadKey((key) => key + 1);
                    }}
                    className="mt-3 rounded-xs border border-line-bright px-2.5 py-1 text-xs text-fog-200 hover:bg-ink-700"
                  >
                    Try again
                  </button>
                </div>
              ) : !deferred.trim() ? (
                <div className="px-5 py-7">
                  <p className="font-mono text-[10px] uppercase tracking-[0.12em] text-fog-500">
                    Search the documentation
                  </p>
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {["poll_rate_hz", "engine mode", "CPS limiter", "mixin", "Safe Mode", "profiles"].map(
                      (example) => (
                        <button
                          key={example}
                          type="button"
                          onClick={() => setQuery(example)}
                          className="rounded-xs border border-line bg-ink-850 px-2 py-1 font-mono text-[11px] text-fog-300 hover:border-line-bright hover:text-fog-100"
                        >
                          {example}
                        </button>
                      ),
                    )}
                  </div>
                  <p className="mt-4 text-xs leading-relaxed text-fog-500">
                    Full-text search covers every page, heading and config key. Use{" "}
                    <span className="text-fog-300">↑ ↓</span> to move and{" "}
                    <span className="text-fog-300">Enter</span> to open.
                  </p>
                </div>
              ) : results.length === 0 ? (
                <div className="px-5 py-9 text-center">
                  <p className="text-sm text-fog-200">No results for “{deferred}”.</p>
                  <p className="mt-1 text-xs text-fog-500">
                    Try a config key, a class name, or a shorter phrase.
                  </p>
                </div>
              ) : (
                <ul className="py-1.5" role="listbox" aria-label="Search results">
                  {results.map((result, position) => (
                    <li key={result.id} role="option" aria-selected={position === active}>
                      <button
                        type="button"
                        onMouseEnter={() => setActive(position)}
                        onClick={() => go(result.href)}
                        className={`flex w-full items-start gap-3 px-4 py-2.5 text-left transition-colors ${
                          position === active ? "bg-accent/[0.07]" : "hover:bg-ink-850"
                        }`}
                      >
                        <FileText
                          size={14}
                          className={`mt-0.5 shrink-0 ${
                            position === active ? "text-accent" : "text-fog-500"
                          }`}
                          aria-hidden
                        />
                        <span className="min-w-0 flex-1">
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="truncate text-[13px] font-medium text-fog-100">
                              {result.heading ? (
                                <span className="text-fog-300">
                                  {result.title} <span className="text-fog-500">/</span>{" "}
                                </span>
                              ) : null}
                              <Highlight text={result.heading ?? result.title} query={deferred} />
                            </span>
                            <span className="shrink-0 font-mono text-[9px] uppercase tracking-[0.08em] text-fog-500">
                              {result.section}
                            </span>
                          </span>
                          <span className="mt-0.5 line-clamp-2 block text-[11.5px] leading-relaxed text-fog-400">
                            <Highlight text={result.snippet} query={deferred} />
                          </span>
                        </span>
                        <ArrowUpRight
                          size={13}
                          className={`mt-1 shrink-0 ${
                            position === active ? "text-accent" : "text-transparent"
                          }`}
                          aria-hidden
                        />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="flex items-center justify-between border-t border-line bg-ink-850 px-4 py-2 text-[10px] text-fog-500">
              <span className="font-mono uppercase tracking-[0.08em]">
                {status === "ready" ? `${results.length} result${results.length === 1 ? "" : "s"}` : "Building index"}
              </span>
              <span className="hidden items-center gap-3 sm:flex">
                <span className="inline-flex items-center gap-1">
                  <span className="kbd">↑</span>
                  <span className="kbd">↓</span>
                  navigate
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="kbd">↵</span>
                  open
                </span>
                <span className="inline-flex items-center gap-1">
                  <span className="kbd">esc</span>
                  close
                </span>
              </span>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function Highlight({ text, query }: { text: string; query: string }) {
  return (
    <>
      {highlight(text, query).map((part, index) =>
        part.hit ? (
          <mark key={index} className="rounded-[2px] bg-accent/20 text-accent-bright">
            {part.text}
          </mark>
        ) : (
          <span key={index}>{part.text}</span>
        ),
      )}
    </>
  );
}
