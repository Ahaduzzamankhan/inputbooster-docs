"use client";

import { ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import type { NavSection } from "@/lib/docs";

export function SidebarNav({
  nav,
  onNavigate,
}: {
  nav: NavSection[];
  onNavigate?: () => void;
}) {
  const pathname = usePathname();
  const activeSection = useMemo(
    () => nav.find((section) => section.groups.some((group) => group.items.some((item) => item.href === pathname))),
    [nav, pathname],
  );
  const [open, setOpen] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    for (const section of nav) {
      initial[section.id] = section.id === (activeSection?.id ?? nav[0]?.id);
    }
    return initial;
  });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!activeSection) return;
    setOpen((current) => ({ ...current, [activeSection.id]: true }));
  }, [activeSection]);

  useEffect(() => {
    const active = containerRef.current?.querySelector<HTMLElement>("[data-active=true]");
    active?.scrollIntoView({ block: "nearest" });
  }, [pathname]);

  return (
    <div ref={containerRef} className="flex flex-col gap-0.5">
      {nav.map((section) => {
        const isOpen = open[section.id] ?? false;
        const hasActive = activeSection?.id === section.id;
        const count = section.groups.reduce((sum, group) => sum + group.items.length, 0);
        return (
          <div key={section.id} className="border-b border-line/60 last:border-0">
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`nav-${section.id}`}
              onClick={() => setOpen((current) => ({ ...current, [section.id]: !isOpen }))}
              className={`group flex w-full items-center gap-2 px-2 py-2.5 text-left transition-colors ${
                hasActive ? "text-fog-50" : "text-fog-300 hover:text-fog-100"
              }`}
            >
              <ChevronRight
                size={13}
                aria-hidden
                className={`shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""} ${
                  hasActive ? "text-accent" : "text-fog-500"
                }`}
              />
              <span className="flex-1 text-[13px] font-semibold tracking-[-0.005em]">
                {section.label}
              </span>
              <span className="font-mono text-[10px] tabular-nums text-fog-500">{count}</span>
            </button>
            <div
              id={`nav-${section.id}`}
              className="grid transition-[grid-template-rows] duration-200 ease-out"
              style={{ gridTemplateRows: isOpen ? "1fr" : "0fr" }}
            >
              <div className="overflow-hidden">
                <div className="pb-2 pl-3">
                  {section.groups.map((group, groupIndex) => (
                    <div key={group.name ?? `ungrouped-${groupIndex}`}>
                      {group.name ? (
                        <div className="px-2 pb-1 pt-2 font-mono text-[9px] uppercase tracking-[0.13em] text-fog-500">
                          {group.name}
                        </div>
                      ) : null}
                      <ul className="space-y-px border-l border-line">
                        {group.items.map((item) => {
                          const active = item.href === pathname;
                          return (
                            <li key={item.href}>
                              <Link
                                href={item.href}
                                onClick={onNavigate}
                                data-active={active}
                                aria-current={active ? "page" : undefined}
                                className={`relative -ml-px flex items-center gap-2 border-l py-1.5 pl-3 pr-2 text-[12.5px] leading-snug transition-colors ${
                                  active
                                    ? "border-accent bg-accent/[0.06] font-medium text-accent-bright"
                                    : "border-transparent text-fog-400 hover:border-line-bright hover:text-fog-100"
                                }`}
                              >
                                <span className="flex-1">{item.title}</span>
                                {item.badge ? (
                                  <span className="rounded-xs border border-accent/25 bg-accent/10 px-1 py-px font-mono text-[8px] uppercase tracking-wide text-accent">
                                    {item.badge}
                                  </span>
                                ) : null}
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
