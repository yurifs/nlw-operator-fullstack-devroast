import {
  AnalysisCardDescription,
  AnalysisCardLabel,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Button } from "@/components/ui/button";
import {
  CodeBlockCodeArea,
  CodeBlockHeaderMac,
  CodeBlockRoot,
} from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";

export async function generateStaticParams() {
  return [{ id: "550e8400-e29b-41d4-a716-446655440000" }];
}

export const metadata = {
  title: "Roast Result | DevRoast",
  description: "Your code has been roasted",
};

export default function RoastResultPage() {
  const code = `function calculateTotal(items) {
  var total = 0;
  for (var i = 0; i < items.length; i++) {
    total = total + items[i].price;
  }
  return total;
}`;

  return (
    <main className="flex flex-col items-center bg-bg-page min-h-[calc(100vh-3.5rem)]">
      <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
        {/* Score Hero */}
        <div className="flex items-center gap-12">
          <ScoreRing score={3.5} className="w-[180px] h-[180px]" />
          <div className="flex flex-col gap-4 flex-1">
            {/* Badge */}
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-accent-red" />
              <span className="text-accent-red font-mono text-sm font-medium">
                verdict: needs_serious_help
              </span>
            </div>
            {/* Title */}
            <h1 className="text-2xl font-normal text-text-primary leading-relaxed">
              &ldquo;this code looks like it was written during a power
              outage... in 2005.&rdquo;
            </h1>
            {/* Meta */}
            <div className="flex items-center gap-4 text-text-tertiary text-xs font-mono">
              <span>lang: javascript</span>
              <span>·</span>
              <span>7 lines</span>
            </div>
            {/* Share Button */}
            <div className="flex gap-3">
              <Button variant="secondary">$ share_roast</Button>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-primary" />

        {/* Code Section */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <span className="text-accent-green font-mono text-sm font-bold">
              {"//"}
            </span>
            <span className="text-text-primary font-mono text-sm font-bold">
              your_submission
            </span>
          </div>
          <CodeBlockRoot>
            <CodeBlockHeaderMac />
            <CodeBlockCodeArea code={code} language="javascript" />
          </CodeBlockRoot>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-primary" />

        {/* Analysis Section */}
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
            {/* Card 1 - Critical */}
            <AnalysisCardRoot variant="critical">
              <AnalysisCardLabel>critical</AnalysisCardLabel>
              <AnalysisCardTitle>
                using var instead of const/let
              </AnalysisCardTitle>
              <AnalysisCardDescription>
                var is function-scoped and leads to hoisting bugs. use const by
                default, let when reassignment is needed.
              </AnalysisCardDescription>
            </AnalysisCardRoot>

            {/* Card 2 - Warning */}
            <AnalysisCardRoot variant="warning">
              <AnalysisCardLabel>warning</AnalysisCardLabel>
              <AnalysisCardTitle>imperative loop pattern</AnalysisCardTitle>
              <AnalysisCardDescription>
                for loops are verbose and error-prone. use .reduce() or .map()
                for cleaner, functional transformations.
              </AnalysisCardDescription>
            </AnalysisCardRoot>

            {/* Card 3 - Good */}
            <AnalysisCardRoot variant="good">
              <AnalysisCardLabel>good</AnalysisCardLabel>
              <AnalysisCardTitle>clear naming conventions</AnalysisCardTitle>
              <AnalysisCardDescription>
                calculateTotal and items are descriptive, self-documenting names
                that communicate intent without comments.
              </AnalysisCardDescription>
            </AnalysisCardRoot>

            {/* Card 4 - Good */}
            <AnalysisCardRoot variant="good">
              <AnalysisCardLabel>good</AnalysisCardLabel>
              <AnalysisCardTitle>single responsibility</AnalysisCardTitle>
              <AnalysisCardDescription>
                the function does one thing well — calculates a total. no side
                effects, no mixed concerns, no hidden complexity.
              </AnalysisCardDescription>
            </AnalysisCardRoot>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-border-primary" />

        {/* Diff Section */}
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
            {/* Diff Header */}
            <div className="flex items-center h-10 px-4 border-b border-border-primary bg-bg-surface">
              <span className="text-text-secondary font-mono text-xs font-medium">
                your_code.js → improved_code.js
              </span>
            </div>
            {/* Diff Body */}
            <div className="flex flex-col bg-bg-input">
              <DiffLine
                type="context"
                code="function calculateTotal(items) {"
              />
              <DiffLine type="removed" code="  var total = 0;" />
              <DiffLine
                type="removed"
                code="  for (var i = 0; i < items.length; i++) {"
              />
              <DiffLine
                type="removed"
                code="    total = total + items[i].price;"
              />
              <DiffLine type="removed" code="  }" />
              <DiffLine type="removed" code="  return total;" />
              <DiffLine
                type="added"
                code="  return items.reduce((sum, item) => sum + item.price, 0);"
              />
              <DiffLine type="context" code="}" />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
