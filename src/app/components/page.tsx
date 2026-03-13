import {
  AnalysisCardDescription,
  AnalysisCardLabel,
  AnalysisCardRoot,
  AnalysisCardTitle,
} from "@/components/ui/analysis-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CodeBlock } from "@/components/ui/code-block";
import { DiffLine } from "@/components/ui/diff-line";
import { ScoreRing } from "@/components/ui/score-ring";
import {
  TableRowCode,
  TableRowLanguage,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from "@/components/ui/table-row";
import { Toggle } from "@/components/ui/toggle";

const buttonVariants = ["primary", "secondary", "ghost", "danger"] as const;
const buttonSizes = ["sm", "md", "lg"] as const;

const badgeVariants = ["critical", "warning", "good", "verdict"] as const;

const sampleCode = `function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}`;

export default function ComponentsPage() {
  return (
    <div className="min-h-screen bg-bg-page p-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <h1 className="text-3xl font-mono text-text-primary">UI Components</h1>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">Button</h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div>
              <h3 className="text-sm text-text-tertiary mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                {buttonVariants.map((variant) => (
                  <Button key={variant} variant={variant}>
                    {variant}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-text-tertiary mb-4">Sizes</h3>
              <div className="flex flex-wrap items-center gap-4">
                {buttonSizes.map((size) => (
                  <Button key={size} size={size}>
                    Size {size}
                  </Button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm text-text-tertiary mb-4">States</h3>
              <div className="flex flex-wrap gap-4">
                <Button>Default</Button>
                <Button disabled>Disabled</Button>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">Badge</h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div>
              <h3 className="text-sm text-text-tertiary mb-4">Variants</h3>
              <div className="flex flex-wrap gap-4">
                {badgeVariants.map((variant) => (
                  <Badge key={variant} variant={variant}>
                    {variant.replace("_", " ")}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">Toggle</h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div className="flex flex-wrap gap-4">
              <Toggle label="roast mode" defaultChecked />
              <Toggle label="dark mode" />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">DiffLine</h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div className="w-full max-w-lg">
              <DiffLine type="removed" code="var total = 0;" />
              <DiffLine type="added" code="const total = 0;" />
              <DiffLine
                type="context"
                code="for (let i = 0; i < items.length; i++) {"
              />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">TableRow</h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div className="w-full max-w-2xl">
              <TableRowRoot>
                <TableRowRank rank={1} />
                <TableRowScore score={9.5} />
                <TableRowCode>
                  <span className="text-text-secondary">
                    function calculateTotal(items) {"{"} var total = 0; ...
                  </span>
                </TableRowCode>
                <TableRowLanguage language="javascript" />
              </TableRowRoot>
              <TableRowRoot>
                <TableRowRank rank={2} />
                <TableRowScore score={7.2} />
                <TableRowCode>
                  <span className="text-text-secondary">
                    const sum = arr.reduce((acc, val) =&gt; ...
                  </span>
                </TableRowCode>
                <TableRowLanguage language="typescript" />
              </TableRowRoot>
              <TableRowRoot>
                <TableRowRank rank={3} />
                <TableRowScore score={4.8} />
                <TableRowCode>
                  <span className="text-text-secondary">
                    for (i = 0; i &lt; n; i++) total += arr[i]
                  </span>
                </TableRowCode>
                <TableRowLanguage language="python" />
              </TableRowRoot>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">ScoreRing</h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div className="flex flex-wrap gap-8 items-center">
              <ScoreRing score={3.5} />
              <ScoreRing score={6.8} />
              <ScoreRing score={9.2} />
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">CodeBlock</h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <CodeBlock
              code={sampleCode}
              language="javascript"
              filename="calculate.js"
            />
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-mono text-text-secondary">
            AnalysisCard
          </h2>

          <div className="space-y-6 p-6 bg-bg-surface rounded-lg border border-border-primary">
            <div className="flex flex-wrap gap-4 max-w-2xl">
              <AnalysisCardRoot variant="critical">
                <AnalysisCardLabel>
                  <Badge variant="critical">critical</Badge>
                </AnalysisCardLabel>
                <AnalysisCardTitle>
                  using var instead of const/let
                </AnalysisCardTitle>
                <AnalysisCardDescription>
                  the var keyword is function-scoped rather than block-scoped,
                  which can lead to unexpected behavior and bugs.
                </AnalysisCardDescription>
              </AnalysisCardRoot>
              <AnalysisCardRoot variant="warning">
                <AnalysisCardLabel>
                  <Badge variant="warning">warning</Badge>
                </AnalysisCardLabel>
                <AnalysisCardTitle>
                  unused variable &apos;total&apos;
                </AnalysisCardTitle>
                <AnalysisCardDescription>
                  the variable total is declared but never used in this scope.
                </AnalysisCardDescription>
              </AnalysisCardRoot>
              <AnalysisCardRoot variant="good">
                <AnalysisCardLabel>
                  <Badge variant="good">good</Badge>
                </AnalysisCardLabel>
                <AnalysisCardTitle>
                  modern javascript patterns
                </AnalysisCardTitle>
                <AnalysisCardDescription>
                  using const for immutable bindings is a good practice.
                </AnalysisCardDescription>
              </AnalysisCardRoot>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
