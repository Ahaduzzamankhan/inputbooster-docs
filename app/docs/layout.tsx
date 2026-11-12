import Link from "next/link";
import { ArrowLeft, ShieldAlert } from "lucide-react";
import { SidebarNav } from "@/components/docs/sidebar-nav";
import { getNav } from "@/lib/docs";
import { site } from "@/lib/site";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const nav = getNav();

  return (
    <div className="mx-auto max-w-[96rem] lg:grid lg:grid-cols-[258px_minmax(0,1fr)]">
      <aside className="hidden border-r border-line lg:block">
        <div className="sticky top-16 flex h-[calc(100vh-4rem)] flex-col overflow-y-auto px-3 py-5">
          <Link
            href="/docs"
            className="mb-4 flex items-center gap-1.5 px-2 font-mono text-[10px] uppercase tracking-[0.1em] text-fog-400 hover:text-accent"
          >
            <ArrowLeft size={11} aria-hidden />
            Documentation index
          </Link>
          <nav aria-label="Documentation">
            <SidebarNav nav={nav} />
          </nav>
          <div className="mt-auto pt-6">
            <div className="rounded-sm border border-warn/20 bg-warn/[0.045] p-3">
              <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-warn">
                <ShieldAlert size={12} aria-hidden />
                Alpha build
              </div>
              <p className="mt-1.5 text-[11px] leading-relaxed text-fog-400">
                {site.version} has not been tested in a running client. 4.0.3-stable is the
                last stable build.
              </p>
            </div>
          </div>
        </div>
      </aside>
      <div className="min-w-0">{children}</div>
    </div>
  );
}
