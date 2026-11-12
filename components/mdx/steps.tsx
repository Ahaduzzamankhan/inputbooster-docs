import { Children, cloneElement, isValidElement, type ReactElement, type ReactNode } from "react";

type StepProps = {
  title?: string;
  children: ReactNode;
  index?: number;
};

export function Step({ title, children, index = 1 }: StepProps) {
  return (
    <div className="step-item">
      <span className="step-number" aria-hidden>
        {String(index).padStart(2, "0")}
      </span>
      <div>
        {title ? <div className="step-title">{title}</div> : null}
        <div className="step-body">{children}</div>
      </div>
    </div>
  );
}

export function Steps({ children }: { children: ReactNode }) {
  const items = Children.toArray(children);
  return (
    <div className="step-list">
      {items.map((child, index) =>
        isValidElement(child)
          ? cloneElement(child as ReactElement<StepProps>, { index: index + 1 })
          : child,
      )}
    </div>
  );
}
