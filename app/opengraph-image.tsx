import { ImageResponse } from "next/og";
import { site } from "@/lib/site";

export const alt = "InputBooster documentation — client-side Minecraft input";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
// The site is exported as static files for GitHub Pages.
export const dynamic = "force-static";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#07090b",
          color: "#e6edf3",
          padding: "64px 72px",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            backgroundImage:
              "linear-gradient(to right, rgba(255,255,255,0.035) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.035) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div
          style={{
            position: "absolute",
            right: "-120px",
            top: "-160px",
            width: "620px",
            height: "620px",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(85,214,232,0.16), rgba(85,214,232,0) 68%)",
            display: "flex",
          }}
        />
        <div style={{ display: "flex", alignItems: "center", gap: 16, position: "relative" }}>
          <div
            style={{
              width: 40,
              height: 40,
              borderRadius: 6,
              border: "1px solid #2b3642",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#55d6e8",
              fontSize: 22,
              fontWeight: 700,
            }}
          >
            ⚡
          </div>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <span style={{ fontSize: 24, fontWeight: 700, letterSpacing: "-0.02em" }}>
              InputBooster
            </span>
            <span
              style={{
                fontSize: 12,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#768494",
              }}
            >
              Documentation
            </span>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", position: "relative", gap: 18 }}>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: 62,
              lineHeight: 1.05,
              fontWeight: 700,
              letterSpacing: "-0.045em",
              maxWidth: 900,
            }}
          >
            <span>The tick is too slow.</span>
            <span style={{ color: "#55d6e8" }}>Your input isn&apos;t.</span>
          </div>
          <div style={{ fontSize: 22, color: "#9ba8b5", maxWidth: 780, lineHeight: 1.4 }}>
            Source-verified documentation for the client-side Minecraft input mod.
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderTop: "1px solid #1c232c",
            paddingTop: 22,
            fontSize: 14,
            color: "#768494",
            position: "relative",
          }}
        >
          <span style={{ letterSpacing: "0.08em", textTransform: "uppercase" }}>
            {site.version} · Minecraft {site.minecraft}
          </span>
          <span>Fabric / NeoForge · Java 25 · Client only</span>
        </div>
      </div>
    ),
    size,
  );
}
