import Link from "next/link";
import { ChevronRight } from "lucide-react";

export function Breadcrumbs({
  items,
}: {
  items: { label: string; href?: string }[];
}) {
  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.08em] text-fog-500">
        <li>
          <Link href="/" className="hover:text-fog-200">
            Home
          </Link>
        </li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
            <ChevronRight size={10} aria-hidden className="text-fog-500" />
            {item.href ? (
              <Link href={item.href} className="hover:text-fog-200">
                {item.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-fog-300">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
