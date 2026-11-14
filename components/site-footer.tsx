import Image from "next/image";
import Link from "next/link";
import { site, withBasePath } from "@/lib/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-line bg-ink-950">
      <div className="mx-auto grid max-w-[96rem] gap-10 px-4 py-12 sm:px-6 md:grid-cols-[1.5fr_1fr_1fr] lg:px-8">
        <div>
          <div className="flex items-center gap-2.5">
            <Image
              src={withBasePath("/inputbooster-icon.png")}
              alt=""
              width={24}
              height={24}
              className="rounded-[4px] border border-line"
            />
            <span className="text-sm font-semibold text-fog-100">InputBooster</span>
            <span className="font-mono text-[10px] text-fog-500">docs</span>
          </div>
          <p className="mt-3 max-w-sm text-xs leading-relaxed text-fog-400">
            Source-verified documentation for a client-side Minecraft input mod. Every
            docs cover the 4.1.2 26.x projects and the separate 3.1.5 1.21.x projects
            settings are marked as such.
          </p>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.1em] text-fog-500">
            MIT · {site.author}
          </p>
        </div>

        <div>
          <div className="eyebrow">Documentation</div>
          <ul className="mt-3 space-y-2 text-xs">
            <li>
              <Link href="/docs/getting-started/overview" className="link-quiet">
                Getting Started
              </Link>
            </li>
            <li>
              <Link href="/docs/guide/settings" className="link-quiet">
                Gamer Guide
              </Link>
            </li>
            <li>
              <Link href="/docs/configuration/config-file" className="link-quiet">
                Configuration
              </Link>
            </li>
            <li>
              <Link href="/docs/developers/architecture" className="link-quiet">
                Developer Docs
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <div className="eyebrow">Project</div>
          <ul className="mt-3 space-y-2 text-xs">
            <li>
              <a href={site.github} target="_blank" rel="noreferrer noopener" className="link-quiet">
                GitHub repository
              </a>
            </li>
            <li>
              <a href={site.issues} target="_blank" rel="noreferrer noopener" className="link-quiet">
                Issue tracker
              </a>
            </li>
            <li>
              <Link href="/docs/releases/changelog" className="link-quiet">
                Changelog
              </Link>
            </li>
            <li>
              <Link href="/docs/troubleshooting/log-reference" className="link-quiet">
                Log reference
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-line/70 px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-[96rem] flex-col gap-1 text-[10px] text-fog-500 sm:flex-row sm:items-center sm:justify-between">
          <span className="font-mono uppercase tracking-[0.08em]">
            Docs build · InputBooster {site.version}
          </span>
          <span>Not affiliated with Mojang Studios or Microsoft.</span>
        </div>
      </div>
    </footer>
  );
}
