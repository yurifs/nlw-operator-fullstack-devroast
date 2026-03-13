import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

export interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  className?: string;
}

export async function CodeBlock({
  code,
  language = "javascript",
  filename,
  className,
}: CodeBlockProps) {
  const html = await codeToHtml(code, {
    lang: language,
    theme: "vesper",
  });

  return (
    <div
      className={twMerge(
        "rounded-md border border-border-primary overflow-hidden",
        className,
      )}
    >
      <div className="flex items-center gap-3 h-10 px-4 border-b border-border-primary">
        <span className="w-3 h-3 rounded-full bg-accent-red" />
        <span className="w-3 h-3 rounded-full bg-accent-amber" />
        <span className="w-3 h-3 rounded-full bg-accent-green" />
        {filename && (
          <>
            <span className="flex-1" />
            <span className="text-text-tertiary font-mono text-xs">
              {filename}
            </span>
          </>
        )}
      </div>
      <div
        className="bg-bg-input font-mono text-sm [&>pre]:!bg-transparent [&>pre]:!p-4 [&>pre]:!m-0 [&>code]:!bg-transparent [&>code]:!p-0"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates trusted HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}
