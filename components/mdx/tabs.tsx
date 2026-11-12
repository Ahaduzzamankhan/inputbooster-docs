"use client";

import { Children, isValidElement, useId, useRef, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

type TabProps = {
  label: string;
  children: ReactNode;
};

export function Tab({ children }: TabProps) {
  return <>{children}</>;
}

export function Tabs({
  children,
  items,
  label = "Content tabs",
}: {
  children: ReactNode;
  items?: string[];
  label?: string;
}) {
  const reduceMotion = useReducedMotion();
  const id = useId();
  const listRef = useRef<HTMLDivElement>(null);
  const elements = Children.toArray(children).filter(isValidElement) as React.ReactElement<TabProps>[];
  const labels = items ?? elements.map((element) => element.props.label);
  const [active, setActive] = useState(0);
  const safeActive = Math.min(active, labels.length - 1);

  function move(direction: number) {
    const next = (safeActive + direction + labels.length) % labels.length;
    setActive(next);
    const buttons = listRef.current?.querySelectorAll<HTMLButtonElement>("[role=tab]");
    buttons?.[next]?.focus();
  }

  return (
    <div className="my-7 overflow-hidden rounded-sm border border-line bg-ink-900">
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className="flex gap-0 overflow-x-auto border-b border-line bg-ink-850 px-1"
        onKeyDown={(event) => {
          if (event.key === "ArrowRight") {
            event.preventDefault();
            move(1);
          } else if (event.key === "ArrowLeft") {
            event.preventDefault();
            move(-1);
          } else if (event.key === "Home") {
            event.preventDefault();
            setActive(0);
          } else if (event.key === "End") {
            event.preventDefault();
            setActive(labels.length - 1);
          }
        }}
      >
        {labels.map((labelText, index) => (
          <button
            key={`${labelText}-${index}`}
            type="button"
            role="tab"
            id={`${id}-tab-${index}`}
            aria-selected={index === safeActive}
            aria-controls={`${id}-panel-${index}`}
            tabIndex={index === safeActive ? 0 : -1}
            onClick={() => setActive(index)}
            className={`relative shrink-0 px-3.5 py-2.5 font-mono text-[11px] uppercase tracking-[0.06em] transition-colors ${
              index === safeActive ? "text-accent" : "text-fog-400 hover:text-fog-100"
            }`}
          >
            {labelText}
            {index === safeActive ? (
              <motion.span
                layoutId={`${id}-tab-underline`}
                className="absolute inset-x-2 bottom-0 h-px bg-accent"
                transition={reduceMotion ? { duration: 0 } : { type: "spring", stiffness: 500, damping: 40 }}
              />
            ) : null}
          </button>
        ))}
      </div>
      {elements.map((element, index) => (
        <div
          key={index}
          role="tabpanel"
          id={`${id}-panel-${index}`}
          aria-labelledby={`${id}-tab-${index}`}
          hidden={index !== safeActive}
          className="px-4 py-1 [&>*:first-child]:mt-3 [&>*:last-child]:mb-3"
        >
          {element}
        </div>
      ))}
    </div>
  );
}
