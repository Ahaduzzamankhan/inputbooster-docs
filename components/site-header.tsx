"use client";

import { Command, Search } from "lucide-react";
import { GithubMark } from "@/components/ui/github-mark";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import type { NavSection } from "@/lib/docs";
import { site, topLinks, withBasePath } from "@/lib/site";
import { MobileNav } from "@/components/mobile-nav";
import { SearchDialog } from "@/components/search/search-dialog";

export function SiteHeader({ nav }: { nav: NavSection[] }) {
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();
        setSearchOpen((current) => !current);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 h-16 border-b border-line/80 bg-ink-950/85 backdrop-blur-md">
        <div className="mx-auto flex h-full max-w-[96rem] items-center gap-4 px-4 sm:px-6 lg:px-8">
          <Link href="/" className="group flex shrink-0 items-center gap-2.5" aria-label="InputBooster documentation home">
            <Image
              src={withBasePath("/inputbooster-icon.png")}
              alt=""
              width={28}
              height={28}
              className="rounded-[5px] border border-line-bright/70"
              priority
            />
            <span className="flex items-baseline gap-2">
              <span className="text-[15px] font-semibold tracking-[-0.015em] text-fog-50 transition-colors group-hover:text-white">
                InputBooster
              </span>
              <span className="hidden font-mono text-[9px] uppercase tracking-[0.16em] text-fog-500 sm:inline">
                Docs
              </span>
            </span>
          </Link>

          <nav aria-label="Primary" className="ml-3 hidden items-center gap-1 lg:flex">
            {topLinks.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href.split("/").slice(0, 3).join("/")}/`);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`rounded-xs px-2.5 py-1.5 text-[13px] transition-colors ${
                    active ? "text-fog-50" : "text-fog-400 hover:text-fog-100"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          <div className="ml-auto flex items-center gap-2">
            <Link
              href="/docs/releases/support-matrix"
              className="hidden items-center gap-1.5 rounded-xs border border-line bg-ink-900 px-2 py-1 font-mono text-[10px] text-fog-300 transition-colors hover:border-line-bright hover:text-fog-50 md:inline-flex"
            >
              <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden />
              {site.version}
            </Link>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="hidden h-8 items-center gap-2 rounded-xs border border-line bg-ink-900 px-2.5 text-left text-[12px] text-fog-400 transition-colors hover:border-line-bright hover:text-fog-200 sm:flex sm:w-52"
              aria-label="Search documentation"
              aria-haspopup="dialog"
            >
              <Search size={13} aria-hidden />
              <span className="flex-1 truncate">Search docs…</span>
              <span className="inline-flex items-center gap-0.5 font-mono text-[9px] text-fog-500">
                <Command size={9} aria-hidden />K
              </span>
            </button>

            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xs border border-line text-fog-300 hover:border-line-bright hover:text-fog-50 sm:hidden"
              aria-label="Search documentation"
            >
              <Search size={16} aria-hidden />
            </button>

            <a
              href={site.github}
              target="_blank"
              rel="noreferrer noopener"
              aria-label="InputBooster on GitHub"
              className="hidden h-9 w-9 items-center justify-center rounded-xs border border-line text-fog-300 transition-colors hover:border-line-bright hover:text-fog-50 sm:inline-flex"
            >
              <GithubMark size={16} />
            </a>

            <div className="lg:hidden">
              <MobileNav nav={nav} onSearch={() => setSearchOpen(true)} />
            </div>

          </div>
        </div>
      </header>
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
