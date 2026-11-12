import type { Metadata, Viewport } from "next";
import "@fontsource-variable/inter";
import "@fontsource-variable/jetbrains-mono";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { getNav } from "@/lib/docs";
import { site, ogImage } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} Documentation`,
    template: `%s · ${site.name} Docs`,
  },
  description: site.description,
  applicationName: site.name,
  authors: [{ name: site.author }],
  creator: site.author,
  keywords: [
    "InputBooster",
    "Minecraft mod",
    "input polling",
    "Fabric",
    "NeoForge",
    "client-side mod",
    "Minecraft 26.2",
    "Minecraft 26.3",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: `${site.name} Documentation`,
    title: `${site.name} Documentation`,
    description: site.description,
    url: "/",
    locale: "en_US",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: `${site.name} documentation — client-side Minecraft input`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} Documentation`,
    description: site.description,
    images: [ogImage],
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#07090b",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const nav = getNav();
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <a
          href="#main-content"
          className="sr-only z-[100] rounded-xs bg-accent px-3 py-2 font-medium text-ink-950 focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <SiteHeader nav={nav} />
        <main id="main-content" className="min-h-[70vh] pt-16">
          {children}
        </main>
        <SiteFooter />
      </body>
    </html>
  );
}
