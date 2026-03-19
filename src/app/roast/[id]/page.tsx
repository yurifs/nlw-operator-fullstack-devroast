import { notFound } from "next/navigation";
import {
  AnalysisCardDescription,
  AnalysisCardLabel,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { CodeBlockCodeArea, CodeBlockRoot } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import { caller } from "@/trpc/server";

export default async function RoastResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    notFound();
  }

  const roast = await caller.roast.getById({ id });

  if (!roast) {
    notFound();
  }

  const diffLines = roast.suggestedFix
    ? roast.suggestedFix.split("\n").map((line) => {
        if (line.startsWith("+")) {
          return { type: "added" as const, code: line.slice(1) };
        }
        if (line.startsWith("-")) {
          return { type: "removed" as const, code: line.slice(1) };
        }
        return { type: "context" as const, code: line };
      })
    : [];

  return (
    <main className="flex flex-col items-center bg-bg-page min-h-[calc(100vh-3.5rem)]">
      <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
        <div className="flex items-center gap-12">
          <ScoreRing score={roast.score} className="w-[180px] h-[180px]" />
          <div className="flex flex-col gap-4 flex-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-accent-red font-mono text-sm font-medium">
                verdict: {roast.verdict}
              </span>
            </div>
            <h1 className="text-2xl font-normal text-text-primary leading-relaxed">
              &ldquo;{roast.roastQuote}&rdquo;
            </h1>
            <div className="flex items-center gap-4 text-text-tertiary text-xs font-mono">
              <span>lang: {roast.language}</span>
              <span>·</span>
              <span>{roast.lineCount} lines</span>
            </div>
          </div>
        </div>

        <div className="h-px bg-border-primary" />

        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              your_submission
            </span>
          </div>
          <div className="border border-border-primary">
            <CodeBlockRoot>
              <CodeBlockCodeArea code={roast.code} language={roast.language} />
            </CodeBlockRoot>
          </div>
        </div>

        <div className="h-px bg-border-primary" />

        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              detailed_analysis
            </span>
          </div>
          <div className="grid grid-cols-2 gap-5">
            {roast.analysisItems.map((item) => (
              <AnalysisCardRoot key={item.id} variant={item.severity}>
                <AnalysisCardLabel>{item.severity}</AnalysisCardLabel>
                <AnalysisCardTitle>{item.title}</AnalysisCardTitle>
                <AnalysisCardDescription>
                  {item.description}
                </AnalysisCardDescription>
              </AnalysisCardRoot>
            ))}
          </div>
        </div>

        {diffLines.length > 0 && (
          <>
            <div className="h-px bg-border-primary" />
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-2">
                <span className="text-accent-green font-mono text-sm font-bold">
                  {"//"}
                </span>
                <span className="text-text-primary font-mono text-sm font-bold">
                  suggested_fix
                </span>
              </div>
              <div className="flex flex-col border border-border-primary rounded-md overflow-hidden">
                <div className="flex items-center h-10 px-4 border-b border-border-primary bg-bg-surface">
                  <span className="text-text-secondary font-mono text-xs font-medium">
                    your_code.js → improved_code.js
                  </span>
                </div>
                <div className="flex flex-col bg-bg-input">
                  {diffLines.map((line, i) => (
                    <DiffLine key={i} type={line.type} code={line.code} />
                  ))}
                </div>
              </div>
            </div>
          </>
        )}
      </section>
    </main>
  );
}
