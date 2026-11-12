"use client";

import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

type CopyButtonProps = {
  text?: string;
  getText?: () => string;
  label?: string;
  className?: string;
};

export function CopyButton({ text, getText, label = "Copy", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const copy = useCallback(async () => {
    const value = text ?? getText?.() ?? "";
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      const area = document.createElement("textarea");
      area.value = value;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      document.body.removeChild(area);
    }
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, [getText, text]);

  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex items-center gap-1.5 rounded-xs px-1.5 py-1 font-mono text-[10px] uppercase tracking-[0.09em] text-fog-400 transition-colors hover:bg-ink-700 hover:text-fog-100 ${className}`}
      aria-label={copied ? "Copied" : label}
    >
      {copied ? <Check size={12} aria-hidden /> : <Copy size={12} aria-hidden />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}
