"use client";

import { ExternalLink, Play } from "lucide-react";
import { useState } from "react";

function youtubeId(url: string): string | null {
  try {
    const parsed = new URL(url);
    if (parsed.hostname === "youtu.be") return parsed.pathname.slice(1) || null;
    if (parsed.hostname.endsWith("youtube.com")) {
      if (parsed.pathname === "/watch") return parsed.searchParams.get("v");
      const parts = parsed.pathname.split("/").filter(Boolean);
      if (parts[0] === "embed" || parts[0] === "shorts") return parts[1] ?? null;
    }
  } catch {
    return null;
  }
  return null;
}

export function VideoEmbed({
  src,
  title,
  description,
}: {
  src: string;
  title: string;
  description?: string;
}) {
  const [active, setActive] = useState(false);
  const id = youtubeId(src);
  const isDirectVideo = /\.(mp4|webm|ogg)(\?.*)?$/i.test(src);

  return (
    <figure className="my-7 overflow-hidden rounded-sm border border-line bg-ink-900">
      <div className="relative aspect-video bg-ink-950">
        {active && id ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0`}
            title={title}
            className="absolute inset-0 h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : active && isDirectVideo ? (
          <video src={src} controls autoPlay className="absolute inset-0 h-full w-full" />
        ) : (
          <div className="absolute inset-0 tech-grid-fine">
            <div className="absolute inset-0 bg-gradient-to-br from-ink-900/40 via-transparent to-accent/5" />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-6 text-center">
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-fog-500">
                {id || isDirectVideo ? "Video reference" : "External reference"}
              </span>
              <span className="max-w-md text-sm text-fog-200">{title}</span>
              {id || isDirectVideo ? (
                <button
                  type="button"
                  onClick={() => setActive(true)}
                  className="mt-1 inline-flex items-center gap-2 rounded-xs border border-accent/40 bg-accent/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-accent-bright transition-colors hover:bg-accent/20"
                >
                  <Play size={13} aria-hidden />
                  Load video
                </button>
              ) : (
                <a
                  href={src}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="mt-1 inline-flex items-center gap-2 rounded-xs border border-line-bright px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-fog-200 hover:text-white"
                >
                  <ExternalLink size={13} aria-hidden />
                  Open externally
                </a>
              )}
            </div>
          </div>
        )}
      </div>
      {(title || description) && (
        <figcaption className="border-t border-line px-4 py-3">
          <div className="text-sm font-medium text-fog-100">{title}</div>
          {description ? <div className="mt-0.5 text-xs text-fog-400">{description}</div> : null}
        </figcaption>
      )}
    </figure>
  );
}
