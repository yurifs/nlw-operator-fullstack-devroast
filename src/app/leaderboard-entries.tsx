import { cacheLife } from "next/cache";
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
import { caller } from "@/trpc/server";

function truncateCode(code: string, maxLines: number): string {
  const lines = code.split("\n");
  return lines.slice(0, maxLines).join("\n");
}

export async function LeaderboardEntries({ limit }: { limit: number }) {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 3600, expire: 3600 });

  const { entries } = await caller.leaderboard.getLeaderboard({ limit });

  return (
    <div className="flex flex-col gap-5">
      {entries.map((entry, index) => {
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
  );
}
