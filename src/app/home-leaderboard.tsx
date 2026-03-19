import Link from "next/link";
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
import { LeaderboardEntryCode } from "./leaderboard-entry-code";

function truncateCode(code: string, maxLines: number): string {
  const lines = code.split("\n");
  return lines.slice(0, maxLines).join("\n");
}

export async function HomeLeaderboard() {
  const { entries, totalCount } = await caller.leaderboard.getLeaderboard({
    limit: 3,
  });

  return (
    <>
      <div className="flex flex-col gap-4">
        {entries.map((entry, index) => {
          const previewCode = truncateCode(entry.code, 5);

          return (
            <CodeBlock key={entry.id}>
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
          );
        })}
      </div>

      <Link
        href="/leaderboard"
        className="text-text-tertiary text-xs text-center py-4 hover:text-text-secondary transition-colors"
      >
        showing top 3 of {totalCount.toLocaleString()} · view full leaderboard
        &gt;&gt;
      </Link>
    </>
  );
}
