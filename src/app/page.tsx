"use client";

import Link from "next/link";
import { CodeEditor } from "@/components/code-editor";
import {
  TableRowCode,
  TableRowLanguage,
  TableRowRank,
  TableRowRoot,
  TableRowScore,
} from "@/components/ui/table-row";

const leaderboardData = [
  {
    rank: 1,
    score: 1.2,
    codeLines: [
      'eval(prompt("enter code"))',
      "document.write(response)",
      "// trust the user lol",
    ],
    language: "javascript",
  },
  {
    rank: 2,
    score: 1.8,
    codeLines: [
      "if (x == true) { return true; }",
      "else if (x == false) { return false; }",
      "else { return !false; }",
    ],
    language: "typescript",
  },
  {
    rank: 3,
    score: 2.1,
    codeLines: ["SELECT * FROM users WHERE 1=1", "-- TODO: add authentication"],
    language: "sql",
  },
];

export default function Home() {
  return (
    <main className="flex flex-col items-center px-10 pt-20">
      {/* Hero Section - centered */}
      <section className="flex flex-col items-center gap-3 text-center mb-8">
        <h1 className="flex items-center gap-3 text-4xl font-bold text-text-primary">
          <span className="text-accent-green">$</span>
          paste your code. get roasted.
        </h1>
        <p className="text-text-secondary text-sm">
          {"//"} drop your code below and we&apos;ll rate it — brutally honest
          or full roast mode
        </p>
      </section>

      <CodeEditor />

      {/* Footer Stats - full width */}
      <section className="w-full flex items-center justify-center gap-6 text-text-tertiary text-xs mb-8">
        <span>2,847 codes roasted</span>
        <span>·</span>
        <span>avg score: 4.2/10</span>
      </section>

      {/* Spacer - 60px */}
      <div className="h-15" />

      {/* Leaderboard Preview - 960px centered */}
      <section className="w-full max-w-[960px] flex flex-col gap-6">
        {/* Title Row */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-accent-green text-sm font-bold">{"//"}</span>
            <span className="text-text-primary text-sm font-bold">
              shame_leaderboard
            </span>
          </div>
          <Link
            href="/leaderboard"
            className="px-3 py-1.5 border border-border-primary hover:bg-bg-elevated transition-colors"
          >
            <span className="text-text-secondary text-xs">
              $ view_all &gt;&gt;
            </span>
          </Link>
        </div>

        <p className="text-text-tertiary text-sm">
          {"//"} the worst code on the internet, ranked by shame
        </p>

        <div className="border border-border-primary rounded-md overflow-hidden">
          {/* Table Header */}
          <div className="flex items-center h-10 px-5 bg-bg-surface border-b border-border-primary">
            <span className="w-12 text-text-tertiary text-xs font-medium">
              #
            </span>
            <span className="w-16 text-text-tertiary text-xs font-medium">
              score
            </span>
            <span className="flex-1 text-text-tertiary text-xs font-medium">
              code
            </span>
            <span className="w-24 text-text-secondary text-xs font-medium">
              lang
            </span>
          </div>

          {/* Table Rows */}
          {leaderboardData.map((row) => (
            <TableRowRoot key={row.rank}>
              <TableRowRank rank={row.rank} />
              <TableRowScore score={row.score} />
              <TableRowCode>
                {row.codeLines.map((line) => (
                  <span
                    key={line}
                    className={`font-mono text-sm ${line.startsWith("//") ? "text-text-tertiary" : "text-text-secondary"}`}
                  >
                    {line}
                  </span>
                ))}
              </TableRowCode>
              <TableRowLanguage language={row.language} />
            </TableRowRoot>
          ))}
        </div>

        <Link
          href="/leaderboard"
          className="text-text-tertiary text-xs text-center py-4 hover:text-text-secondary transition-colors"
        >
          showing top 3 of 2,847 · view full leaderboard &gt;&gt;
        </Link>
      </section>
    </main>
  );
}
