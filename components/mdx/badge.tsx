import type { ReactNode } from "react";

const variants = {
  default: "border-line-bright bg-ink-800 text-fog-200",
  accent: "border-accent/30 bg-accent/10 text-accent-bright",
  warn: "border-warn/30 bg-warn/10 text-warn",
  danger: "border-danger/30 bg-danger/10 text-danger",
  success: "border-success/30 bg-success/10 text-success",
  muted: "border-line bg-ink-850 text-fog-400",
} as const;

export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: ReactNode;
  variant?: keyof typeof variants;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-xs border px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.08em] ${variants[variant]} ${className}`}
    >
      {children}
    </span>
  );
}
