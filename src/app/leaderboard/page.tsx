import { LeaderboardEntryCode } from "@/app/leaderboard-entry-code";
import {
  CodeBlock,
  CodeBlockCodeArea,
  CodeBlockHeaderMetaContainer,
  CodeBlockHeaderMetaLanguage,
  CodeBlockHeaderMetaLineCount,
  CodeBlockHeaderMetaRank,
  CodeBlockHeaderMetaScore,
} from "@/components/ui/code-block";
import { caller, HydrateClient, prefetch, trpc } from "@/trpc/server";

export const revalidate = 3600;

prefetch(trpc.roast.getStats.queryOptions());

function truncateCode(code: string, maxLines: number): string {
  const lines = code.split("\n");
  return lines.slice(0, maxLines).join("\n");
}

export const metadata = {
  title: "Shame Leaderboard | DevRoast",
  description: "The most roasted code on the internet - ranked by shame",
};

export default async function LeaderboardPage() {
  const [stats, entries] = await Promise.all([
    caller.roast.getStats(),
    caller.leaderboard.getLeaderboard({ limit: 20 }),
  ]);

  return (
    <HydrateClient>
      <main className="flex flex-col items-center min-h-screen bg-bg-page">
        <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-accent-green text-3xl font-bold">
                {">"}
              </span>
              <h1 className="text-text-primary text-3xl font-bold">
                shame_leaderboard
              </h1>
            </div>
            <p className="text-text-secondary text-sm">
              {`// the most roasted code on the internet`}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-text-tertiary text-xs">
                {`${stats.totalRoasts.toLocaleString()} submissions`}
              </span>
              <span className="text-text-tertiary text-xs">·</span>
              <span className="text-text-tertiary text-xs">
                {`avg score: ${stats.avgScore?.toFixed(1) ?? "0.0"}/10`}
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-5">
            {entries.entries.map((entry, index) => {
              const previewCode = truncateCode(entry.code, 5);

              return (
                <div key={entry.id} className="border border-border-primary">
                  <CodeBlock>
                    <CodeBlockHeaderMetaContainer>
                      <div className="flex items-center gap-4">
                        <CodeBlockHeaderMetaRank rank={index + 1} />
                        <CodeBlockHeaderMetaScore score={entry.score} />
                      </div>
                      <div className="flex items-center gap-3">
                        <CodeBlockHeaderMetaLanguage>
                          {entry.language}
                        </CodeBlockHeaderMetaLanguage>
                        <CodeBlockHeaderMetaLineCount>
                          {entry.lineCount}
                        </CodeBlockHeaderMetaLineCount>
                      </div>
                    </CodeBlockHeaderMetaContainer>

                    <LeaderboardEntryCode
                      lineCount={entry.lineCount}
                      preview={
                        <CodeBlockCodeArea
                          code={previewCode}
                          language={entry.language}
                        />
                      }
                      fullCode={
                        <CodeBlockCodeArea
                          code={entry.code}
                          language={entry.language}
                        />
                      }
                    />
                  </CodeBlock>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </HydrateClient>
  );
}
