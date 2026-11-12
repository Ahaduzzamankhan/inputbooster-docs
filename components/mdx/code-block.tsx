import { codeToHtml } from "shiki";
import { CodeShell } from "@/components/ui/code-shell";

type CodeBlockProps = {
  code: string;
  language?: string;
  title?: string;
  showLineNumbers?: boolean;
};

export async function CodeBlock({
  code,
  language = "text",
  title,
  showLineNumbers = false,
}: CodeBlockProps) {
  let html: string;
  try {
    html = await codeToHtml(code.replace(/\n$/, ""), {
      lang: language,
      theme: "github-dark-default",
    });
  } catch {
    html = await codeToHtml(code.replace(/\n$/, ""), {
      lang: "text",
      theme: "github-dark-default",
    });
  }

  html = html.replace(/<span class="line"/g, '<span data-line class="line"');
  if (showLineNumbers) html = html.replace("<code", "<code data-line-numbers");

  return (
    <CodeShell html={html} language={language} title={title} showLineNumbers={showLineNumbers} />
  );
}
