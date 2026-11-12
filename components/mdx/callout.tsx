import type { ReactNode } from "react";
import { AlertTriangle, CheckCircle2, CircleAlert, Info, Lightbulb } from "lucide-react";

type CalloutVariant = "note" | "info" | "warning" | "danger" | "success";

const icons = {
  note: Lightbulb,
  info: Info,
  warning: AlertTriangle,
  danger: CircleAlert,
  success: CheckCircle2,
} as const;

const defaultTitles: Record<CalloutVariant, string> = {
  note: "Note",
  info: "Details",
  warning: "Warning",
  danger: "Caution",
  success: "Verified",
};

export function Callout({
  children,
  variant = "note",
  title,
}: {
  children: ReactNode;
  variant?: CalloutVariant;
  title?: string;
}) {
  const Icon = icons[variant];
  const color =
    variant === "danger"
      ? "text-danger"
      : variant === "warning"
        ? "text-warn"
        : variant === "success"
          ? "text-success"
          : variant === "info"
            ? "text-accent"
            : "text-fog-300";

  return (
    <aside className={`callout callout-${variant}`} role="note">
      <Icon size={17} strokeWidth={1.8} className={`mt-0.5 ${color}`} aria-hidden />
      <div>
        <div className={`callout-title ${color}`}>{title ?? defaultTitles[variant]}</div>
        <div className="text-fog-200">{children}</div>
      </div>
    </aside>
  );
}
