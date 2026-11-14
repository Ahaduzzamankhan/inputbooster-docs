"use client";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { ArrowUpRight, Menu, Search, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavSection } from "@/lib/docs";
import { SidebarNav } from "@/components/docs/sidebar-nav";

export function MobileNav({
  nav,
  onSearch,
}: {
  nav: NavSection[];
  onSearch: () => void;
}) {
  const [open, setOpen] = useState(false);
  const reduceMotion = useReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open documentation menu"
        aria-expanded={open}
        className="inline-flex h-9 w-9 items-center justify-center rounded-xs border border-line text-fog-300 transition-colors hover:border-line-bright hover:text-fog-50 lg:hidden"
      >
        <Menu size={17} aria-hidden />
      </button>

      <AnimatePresence>
        {open ? (
          <motion.div
            className="fixed inset-0 z-[70] lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduceMotion ? 0 : 0.18 }}
          >
            <div
              className="absolute inset-0 bg-ink-950/80 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              aria-hidden
            />
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label="Documentation menu"
              initial={reduceMotion ? false : { x: "100%" }}
              animate={{ x: 0 }}
              exit={reduceMotion ? { opacity: 0 } : { x: "100%" }}
              transition={{ duration: reduceMotion ? 0 : 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="absolute inset-y-0 right-0 flex w-[88%] max-w-sm flex-col border-l border-line bg-ink-950"
            >
              <div className="flex h-16 shrink-0 items-center justify-between border-b border-line px-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog-400">
                  Documentation
                </span>
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  aria-label="Close menu"
                  className="rounded-xs p-1.5 text-fog-300 hover:bg-ink-800 hover:text-fog-50"
                >
                  <X size={18} aria-hidden />
                </button>
              </div>
              <div className="border-b border-line p-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(false);
                    onSearch();
                  }}
                  className="flex w-full items-center gap-2 rounded-xs border border-line bg-ink-900 px-3 py-2 text-sm text-fog-400 hover:border-line-bright hover:text-fog-100"
                >
                  <Search size={14} aria-hidden />
                  Search documentation
                  <span className="ml-auto font-mono text-[10px] text-fog-500">Ctrl K</span>
                </button>
              </div>
              <nav
                aria-label="Documentation"
                className="flex-1 overflow-y-auto overscroll-contain px-2 py-3"
              >
                <SidebarNav nav={nav} onNavigate={() => setOpen(false)} />
              </nav>
              <div className="shrink-0 border-t border-line p-4">
                <a
                  href="https://github.com/Ahaduzzamankhan/inputbooster"
                  target="_blank"
                  rel="noreferrer noopener"
                  className="flex items-center justify-between text-xs text-fog-400 hover:text-fog-100"
                >
                  Source on GitHub
                  <ArrowUpRight size={13} aria-hidden />
                </a>
                <div className="mt-2 font-mono text-[10px] text-fog-500">
                  v4.1.2-beta3 · 7 Fabric targets
                </div>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}
