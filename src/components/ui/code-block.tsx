import { codeToHtml } from "shiki";
import { twMerge } from "tailwind-merge";

interface CodeBlockRootProps {
  className?: string;
  children?: React.ReactNode;
}

function CodeBlockRoot({ className, children }: CodeBlockRootProps) {
  return <div className={twMerge("flex flex-col", className)}>{children}</div>;
}

interface CodeBlockCodeAreaProps {
  code: string;
  language?: string;
  className?: string;
}

async function CodeBlockCodeArea({
  code,
  language = "javascript",
  className,
}: CodeBlockCodeAreaProps) {
  "use cache";

  const html = await codeToHtml(code, {
    lang: language,
    theme: "vesper",
  });

  const lines = code.split("\n");
  const lineNumbers = lines.map((_, i) => i + 1);

  return (
    <div className={twMerge("flex overflow-auto bg-bg-input", className)}>
      <div className="w-10 shrink-0 bg-bg-surface border-r border-border-primary">
        <div className="flex flex-col py-4 px-2.5">
          {lineNumbers.map((num) => (
            <span
              key={num}
              className="font-mono text-xs text-text-tertiary text-right leading-6"
            >
              {num}
            </span>
          ))}
        </div>
      </div>
      <div
        className="flex-1 overflow-auto font-mono text-xs [&>pre]:!bg-transparent [&>pre]:!p-4 [&>pre]:!m-0 [&>code]:!bg-transparent [&>code]:!p-0 [&>code]:!text-inherit leading-6"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: shiki generates trusted HTML
        dangerouslySetInnerHTML={{ __html: html }}
      />
    </div>
  );
}

interface CodeBlockHeaderMacProps {
  filename?: string;
  className?: string;
}

function CodeBlockHeaderMac({ filename, className }: CodeBlockHeaderMacProps) {
  return (
    <div
      className={twMerge(
        "flex items-center gap-3 h-10 px-4 border-b border-border-primary bg-bg-surface",
        className,
      )}
    >
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
  );
}

interface CodeBlockHeaderMetaContainerProps {
  className?: string;
  children?: React.ReactNode;
}

function CodeBlockHeaderMetaContainer({
  className,
  children,
}: CodeBlockHeaderMetaContainerProps) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between h-12 px-5 border-b border-border-primary bg-bg-surface",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface CodeBlockHeaderMetaRankProps {
  rank: number;
  className?: string;
}

function CodeBlockHeaderMetaRank({
  rank,
  className,
}: CodeBlockHeaderMetaRankProps) {
  return (
    <div className={twMerge("flex items-center gap-1.5", className)}>
      <span className="text-text-tertiary text-xs">#</span>
      <span className="text-accent-amber text-xs font-bold">{rank}</span>
    </div>
  );
}

interface CodeBlockHeaderMetaScoreProps {
  score: number;
  className?: string;
}

function CodeBlockHeaderMetaScore({
  score,
  className,
}: CodeBlockHeaderMetaScoreProps) {
  return (
    <div className={twMerge("flex items-center gap-1.5", className)}>
      <span className="text-text-tertiary text-xs">score:</span>
      <span className="text-accent-red text-xs font-bold">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

interface CodeBlockHeaderMetaLanguageProps {
  children: React.ReactNode;
  className?: string;
}

function CodeBlockHeaderMetaLanguage({
  children,
  className,
}: CodeBlockHeaderMetaLanguageProps) {
  return (
    <span className={twMerge("text-text-secondary text-xs", className)}>
      {children}
    </span>
  );
}

interface CodeBlockHeaderMetaLineCountProps {
  children: React.ReactNode;
  className?: string;
}

function CodeBlockHeaderMetaLineCount({
  children,
  className,
}: CodeBlockHeaderMetaLineCountProps) {
  return (
    <span className={twMerge("text-text-tertiary text-xs", className)}>
      {children} lines
    </span>
  );
}

const CodeBlock = Object.assign(CodeBlockRoot, {
  CodeArea: CodeBlockCodeArea,
  HeaderMac: CodeBlockHeaderMac,
  HeaderMeta: CodeBlockHeaderMetaContainer,
});

export {
  CodeBlock,
  CodeBlockRoot,
  CodeBlockCodeArea,
  CodeBlockHeaderMac,
  CodeBlockHeaderMetaContainer,
  CodeBlockHeaderMetaRank,
  CodeBlockHeaderMetaScore,
  CodeBlockHeaderMetaLanguage,
  CodeBlockHeaderMetaLineCount,
};

export type {
  CodeBlockRootProps,
  CodeBlockCodeAreaProps,
  CodeBlockHeaderMacProps,
  CodeBlockHeaderMetaContainerProps,
  CodeBlockHeaderMetaRankProps,
  CodeBlockHeaderMetaScoreProps,
  CodeBlockHeaderMetaLanguageProps,
  CodeBlockHeaderMetaLineCountProps,
};
