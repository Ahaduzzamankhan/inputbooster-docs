import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Boxes,
  Code2,
  Gauge,
  Gamepad2,
  Keyboard,
  MousePointerClick,
  ShieldCheck,
  Terminal,
  Zap,
} from "lucide-react";
import { GithubMark } from "@/components/ui/github-mark";
import { getNav } from "@/lib/docs";
import { site, ogImage } from "@/lib/site";

export const metadata: Metadata = {
  title: "InputBooster Documentation",
  description: site.description,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    title: "InputBooster Documentation",
    description: site.description,
    url: "/",
    siteName: "InputBooster Documentation",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "InputBooster documentation — client-side Minecraft input",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "InputBooster Documentation",
    description: site.description,
    images: [ogImage],
  },
};

const signal = [
  {
    step: "01",
    label: "Platform key state",
    detail: "Raw keyboard and mouse sampling, 60–1000 Hz",
  },
  {
    step: "02",
    label: "Edge state machine",
    detail: "One action per physical press or release",
  },
  {
    step: "03",
    label: "Bounded queue",
    detail: "128 stamped actions, ordered, never unbounded",
  },
  {
    step: "04",
    label: "Client tick",
    detail: "Vanilla calls, guarded per action",
  },
];

const audiences = [
  {
    eyebrow: "For players",
    title: "Tune the input path",
    description:
      "Install the right jar, understand the six vanilla settings sections or four Sodium pages, and know which features help at low FPS — and which are cosmetic.",
    href: "/docs/guide/settings",
    cta: "Open the gamer guide",
    icon: Gamepad2,
    links: [
      { label: "Installation", href: "/docs/getting-started/installation" },
      { label: "Combat settings", href: "/docs/guide/combat-and-movement" },
      { label: "Common issues", href: "/docs/troubleshooting/common-issues" },
    ],
  },
  {
    eyebrow: "For developers",
    title: "Read the internals",
    description:
      "Follow an input from the platform poller to the drainer, audit the mixin contract, and build all seven published Fabric targets from source.",
    href: "/docs/developers/architecture",
    cta: "Open developer docs",
    icon: Code2,
    links: [
      { label: "Input pipeline", href: "/docs/developers/input-pipeline" },
      { label: "Mixin inventory", href: "/docs/reference/mixins" },
      { label: "Build & test", href: "/docs/developers/building-and-testing" },
    ],
  },
];

export default function HomePage() {
  const nav = getNav();

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebSite",
            name: `${site.name} Documentation`,
            url: site.url,
            description: site.description,
          }).replace(/</g, "\\u003c"),
        }}
      />

      <section className="relative overflow-hidden border-b border-line">
        <div className="absolute inset-0 tech-grid opacity-80" aria-hidden />
        <div
          className="absolute inset-0"
          aria-hidden
          style={{
            background:
              "radial-gradient(ellipse 60% 55% at 76% 28%, rgba(85,214,232,0.10), transparent 62%), radial-gradient(ellipse 45% 45% at 18% 0%, rgba(85,214,232,0.05), transparent 70%)",
          }}
        />
        <div className="relative mx-auto grid max-w-[96rem] gap-12 px-4 pb-16 pt-14 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-center lg:gap-16 lg:px-8 lg:pb-20 lg:pt-20">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-xs border border-warn/25 bg-warn/[0.06] px-2 py-1 font-mono text-[9px] uppercase tracking-[0.12em] text-warn">
                <span className="h-1.5 w-1.5 rounded-full bg-warn" aria-hidden />
                Beta · {site.version}
              </span>
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-fog-500">
                Client-side · Minecraft {site.minecraft}
              </span>
            </div>

            <h1 className="mt-6 max-w-[40rem] text-[2.6rem] font-semibold leading-[1.04] tracking-[-0.045em] text-fog-50 sm:text-[3.3rem] lg:text-[3.7rem]">
              The tick is too slow.
              <br />
              <span className="text-gradient">Your input isn&apos;t.</span>
            </h1>

            <p className="mt-6 max-w-[36rem] text-[15px] leading-relaxed text-fog-300 sm:text-base">
              InputBooster samples keyboard and mouse state faster than Minecraft ticks.
              A short tap that starts and ends between two ticks becomes the action vanilla
              would have run — without replacing vanilla&apos;s handlers and without
              inventing a single benchmark number.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-2.5">
              <Link
                href="/docs/getting-started/overview"
                className="inline-flex items-center gap-2 rounded-xs bg-accent px-4 py-2.5 text-[13px] font-semibold text-ink-950 transition-colors hover:bg-accent-bright"
              >
                <BookOpen size={15} aria-hidden />
                Read the documentation
              </Link>
              <Link
                href="/docs/getting-started/installation"
                className="inline-flex items-center gap-2 rounded-xs border border-line-bright bg-ink-900/70 px-4 py-2.5 text-[13px] text-fog-200 transition-colors hover:border-accent/40 hover:text-white"
              >
                <Terminal size={15} aria-hidden />
                Install
              </Link>
              <a
                href={site.github}
                target="_blank"
                rel="noreferrer noopener"
                className="inline-flex items-center gap-2 rounded-xs px-2.5 py-2.5 text-[13px] text-fog-400 transition-colors hover:text-fog-100"
              >
                <GithubMark size={15} />
                Source
              </a>
            </div>

            <dl className="mt-10 grid max-w-[34rem] grid-cols-2 gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-4">
              {[
                ["Loader", "Fabric only"],
                ["Targets", "7 Fabric versions"],
                ["Java", "21 / 25"],
                ["License", "MIT"],
              ].map(([term, value]) => (
                <div key={term} className="bg-ink-950/90 px-3 py-2.5">
                  <dt className="font-mono text-[9px] uppercase tracking-[0.1em] text-fog-500">
                    {term}
                  </dt>
                  <dd className="mt-0.5 text-[11px] text-fog-200">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="relative">
            <div className="absolute -inset-4 rounded-sm bg-accent/[0.035] blur-2xl" aria-hidden />
            <div className="relative overflow-hidden rounded-sm border border-line-bright bg-ink-900/90 shadow-2xl shadow-black/40 backdrop-blur">
              <div className="flex items-center justify-between border-b border-line bg-ink-850/80 px-4 py-2.5">
                <span className="font-mono text-[9px] uppercase tracking-[0.13em] text-fog-400">
                  Signal path
                </span>
                <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.1em] text-accent">
                  <span className="h-1.5 w-1.5 rounded-full bg-accent" aria-hidden />
                  Architecture
                </span>
              </div>

              <div className="p-4">
                <div className="mb-3 rounded-xs border border-line/80 bg-ink-950 px-3 py-2.5">
                  <div className="flex items-center justify-between font-mono text-[10px]">
                    <span className="text-fog-400">POLL_RATE</span>
                    <span className="text-accent">60 → 1000 Hz</span>
                  </div>
                  <div className="mt-2 flex gap-1" aria-hidden>
                    {Array.from({ length: 24 }).map((_, index) => (
                      <span
                        key={index}
                        className="h-4 flex-1 rounded-[1px]"
                        style={{
                          background:
                            index < 16
                              ? `rgba(85,214,232,${0.14 + index * 0.035})`
                              : "rgba(43,54,66,0.55)",
                        }}
                      />
                    ))}
                  </div>
                </div>

                <ol className="space-y-0">
                  {signal.map((item, index) => (
                    <li key={item.step} className="relative grid grid-cols-[2rem_1fr] gap-3 pb-3 last:pb-0">
                      {index < signal.length - 1 ? (
                        <span
                          className="absolute left-[0.92rem] top-7 bottom-0 w-px bg-line"
                          aria-hidden
                        />
                      ) : null}
                      <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full border border-line-bright bg-ink-950 font-mono text-[9px] text-accent">
                        {item.step}
                      </span>
                      <div className="border-b border-line/60 pb-2.5 last:border-0 last:pb-0">
                        <div className="text-[12.5px] font-medium text-fog-100">{item.label}</div>
                        <div className="mt-0.5 font-mono text-[10px] leading-relaxed text-fog-500">
                          {item.detail}
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="grid grid-cols-3 gap-px border-t border-line bg-line">
                {[
                  ["QUEUE", "128"],
                  ["BURST", "1000 Hz"],
                  ["SERVER", "none"],
                ].map(([key, value]) => (
                  <div key={key} className="bg-ink-900 px-3 py-2.5">
                    <div className="font-mono text-[8px] uppercase tracking-[0.12em] text-fog-500">
                      {key}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] text-fog-200">{value}</div>
                  </div>
                ))}
              </div>
            </div>
            <p className="mt-3 text-center font-mono text-[9px] uppercase tracking-[0.1em] text-fog-500">
              Static architecture diagram, not live telemetry
            </p>
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ink-950">
        <div className="mx-auto grid max-w-[96rem] gap-8 px-4 py-14 sm:px-6 lg:grid-cols-[0.8fr_1.2fr] lg:px-8 lg:py-16">
          <div>
            <div className="eyebrow">The honest scope</div>
            <h2 className="mt-3 max-w-sm text-2xl font-semibold tracking-[-0.025em] text-fog-50">
              A recovery path, not a gameplay advantage.
            </h2>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-fog-400">
              The mod makes sure Minecraft sees input you actually produced. It does not
              generate input, alter reach, or hide anything from the server.
            </p>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Keyboard,
                title: "Sampling between ticks",
                body: "Pressed and released edges are captured even when both happen inside one 50 ms tick window.",
              },
              {
                icon: ShieldCheck,
                title: "Vanilla stays in charge",
                body: "Observing mixins run at HEAD and cancel nothing. Another mod's key is never remapped.",
              },
              {
                icon: MousePointerClick,
                title: "One action per edge",
                body: "The poller and the event hooks write through one state machine, so the same press cannot fire twice.",
              },
              {
                icon: Gauge,
                title: "No invented numbers",
                body: "There is no FPS or latency improvement figure on this site because the mod has not been benchmarked in a client.",
              },
            ].map((item) => (
              <div key={item.title} className="rounded-sm border border-line bg-ink-900/40 p-4">
                <item.icon size={17} className="text-accent" strokeWidth={1.7} aria-hidden />
                <div className="mt-3 text-[13px] font-semibold text-fog-100">{item.title}</div>
                <p className="mt-1.5 text-[11.5px] leading-relaxed text-fog-400">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-line bg-ink-900/30">
        <div className="mx-auto max-w-[96rem] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <div className="eyebrow">Two ways in</div>
              <h2 className="mt-3 text-2xl font-semibold tracking-[-0.025em] text-fog-50">
                Built for players and for maintainers.
              </h2>
            </div>
            <Link
              href="/docs"
              className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fog-400 hover:text-accent"
            >
              Full documentation index <ArrowRight size={12} aria-hidden />
            </Link>
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-2">
            {audiences.map((audience) => (
              <div
                key={audience.title}
                className="group relative overflow-hidden rounded-sm border border-line bg-ink-950 p-5 transition-colors hover:border-line-bright"
              >
                <div className="absolute inset-x-0 top-0 h-px accent-rule opacity-0 transition-opacity group-hover:opacity-100" aria-hidden />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <audience.icon size={17} className="text-accent" strokeWidth={1.7} aria-hidden />
                    <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-fog-500">
                      {audience.eyebrow}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] text-fog-600">↗</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-fog-50">
                  {audience.title}
                </h3>
                <p className="mt-2 max-w-md text-[12.5px] leading-relaxed text-fog-400">
                  {audience.description}
                </p>
                <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1.5">
                  {audience.links.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} className="text-[11.5px] text-fog-300 hover:text-accent">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
                <Link
                  href={audience.href}
                  className="mt-5 inline-flex items-center gap-1.5 text-[12px] font-medium text-accent hover:text-accent-bright"
                >
                  {audience.cta} <ArrowRight size={12} aria-hidden />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-ink-950">
        <div className="mx-auto max-w-[96rem] px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
          <div className="eyebrow">Documentation map</div>
          <div className="mt-6 grid gap-px overflow-hidden rounded-sm border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {nav.map((section) => {
              const first = section.groups[0]?.items[0];
              return (
                <Link
                  key={section.id}
                  href={first?.href ?? "/docs"}
                  className="group flex flex-col bg-ink-950 p-4 transition-colors hover:bg-ink-900"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[9px] text-fog-500">
                      {String(section.order).padStart(2, "0")}
                    </span>
                    <ArrowRight
                      size={12}
                      className="text-fog-600 transition-transform group-hover:translate-x-0.5 group-hover:text-accent"
                      aria-hidden
                    />
                  </div>
                  <div className="mt-2 text-[13px] font-semibold text-fog-100">{section.label}</div>
                  <p className="mt-1 text-[11px] leading-relaxed text-fog-500">
                    {section.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto max-w-[96rem] px-4 py-12 sm:px-6 lg:px-8">
          <div className="rounded-sm border border-warn/20 bg-warn/[0.035] p-5 sm:flex sm:items-start sm:justify-between sm:gap-8">
            <div className="flex gap-3">
              <Boxes size={18} className="mt-0.5 shrink-0 text-warn" strokeWidth={1.7} aria-hidden />
              <div>
                <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-warn">
                  Beta status
                </div>
                <p className="mt-1.5 max-w-2xl text-[12.5px] leading-relaxed text-fog-300">
                  {site.version} is published as a beta. The latest CI run builds and tests all seven targets, but the current workflow does not launch a headless Minecraft client. 4.0.3-stable remains the last stable build. Read the limitations page for the remaining runtime-coverage gap.
                </p>
              </div>
            </div>
            <Link
              href="/docs/reference/limitations"
              className="mt-4 inline-flex shrink-0 items-center gap-1.5 rounded-xs border border-warn/30 px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.06em] text-warn hover:bg-warn/10 sm:mt-0"
            >
              Limitations <ArrowRight size={11} aria-hidden />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
