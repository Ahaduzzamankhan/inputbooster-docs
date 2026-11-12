import type { ComponentPropsWithoutRef, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import type { MDXComponents } from "mdx/types";
import { Callout } from "@/components/mdx/callout";
import { Tabs, Tab } from "@/components/mdx/tabs";
import { Steps, Step } from "@/components/mdx/steps";
import { CodeBlock } from "@/components/mdx/code-block";
import { FileTree } from "@/components/mdx/file-tree";
import { FileRef } from "@/components/mdx/file-ref";
import { Badge } from "@/components/mdx/badge";
import { VideoEmbed } from "@/components/mdx/video-embed";
import { Command } from "@/components/mdx/command";
import { Mermaid } from "@/components/mdx/mermaid";
import { Kbd } from "@/components/mdx/kbd";
import { CodeFence } from "@/components/ui/code-shell";
import { withBasePath } from "@/lib/site";

function headingId(children: ReactNode): string | undefined {
  if (typeof children === "string") {
    return children.toLowerCase().replace(/[^\p{L}\p{N}\s-]/gu, "").trim().replace(/\s+/g, "-");
  }
  return undefined;
}

function H2({ id, children }: ComponentPropsWithoutRef<"h2">) {
  const anchor = id ?? headingId(children);
  return (
    <h2 id={anchor} className="anchor-heading group">
      <a className="heading-link" href={anchor ? `#${anchor}` : undefined}>
        {children}
        <span className="anchor-mark" aria-hidden>
          #
        </span>
      </a>
    </h2>
  );
}

function H3({ id, children }: ComponentPropsWithoutRef<"h3">) {
  const anchor = id ?? headingId(children);
  return (
    <h3 id={anchor} className="anchor-heading group">
      <a className="heading-link" href={anchor ? `#${anchor}` : undefined}>
        {children}
        <span className="anchor-mark" aria-hidden>
          #
        </span>
      </a>
    </h3>
  );
}

function Anchor({ href = "", children, ...rest }: ComponentPropsWithoutRef<"a">) {
  const external = /^https?:\/\//.test(href);
  // Internal markdown links are plain anchors, so the base path has to be
  // added here: next/link adds it automatically, an <a> does not.
  const resolved = external ? href : withBasePath(href);
  return (
    <a
      href={resolved}
      {...rest}
      {...(external ? { target: "_blank", rel: "noreferrer noopener" } : {})}
    >
      {children}
      {external ? (
        <ArrowUpRight size={12} className="ml-0.5 inline-block text-fog-500" aria-hidden />
      ) : null}
    </a>
  );
}

function Table(props: ComponentPropsWithoutRef<"table">) {
  return (
    <div className="table-wrap">
      <table {...props} />
    </div>
  );
}

function Pre(props: ComponentPropsWithoutRef<"pre">) {
  return <CodeFence {...props} />;
}

function Img({ alt = "", ...rest }: ComponentPropsWithoutRef<"img">) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt={alt} loading="lazy" {...rest} />;
}

export function Lead({ children }: { children: ReactNode }) {
  return (
    <p className="lead not-prose mb-7 border-l border-line-bright pl-4 text-[1.03rem] leading-relaxed text-fog-300">
      {children}
    </p>
  );
}

export const mdxComponents: MDXComponents = {
  Callout,
  Tabs,
  Tab,
  Steps,
  Step,
  CodeBlock,
  FileTree,
  FileRef,
  Badge,
  VideoEmbed,
  Command,
  Mermaid,
  Kbd,
  Lead,
  h2: H2,
  h3: H3,
  a: Anchor,
  table: Table,
  pre: Pre,
  img: Img,
};
