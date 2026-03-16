import { twMerge } from "tailwind-merge";

interface TableRowLeaderboardRootProps {
  className?: string;
  children?: React.ReactNode;
}

function TableRowLeaderboardRoot({
  className,
  children,
}: TableRowLeaderboardRootProps) {
  return <div className={twMerge("flex flex-col", className)}>{children}</div>;
}

interface TableRowLeaderboardMetaProps {
  rank: number;
  score: number;
  language: string;
  lineCount: number;
  className?: string;
}

function TableRowLeaderboardMeta({
  rank,
  score,
  language,
  lineCount,
  className,
}: TableRowLeaderboardMetaProps) {
  return (
    <div
      className={twMerge(
        "flex items-center justify-between h-12 px-5 border-b border-border-primary bg-bg-surface",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <TableRowLeaderboardRank rank={rank} />
        <TableRowLeaderboardScore score={score} />
      </div>
      <div className="flex items-center gap-3">
        <TableRowLeaderboardLanguage language={language} />
        <TableRowLeaderboardLineCount lineCount={lineCount} />
      </div>
    </div>
  );
}

interface TableRowLeaderboardRankProps {
  rank: number;
  className?: string;
}

function TableRowLeaderboardRank({
  rank,
  className,
}: TableRowLeaderboardRankProps) {
  return (
    <div className={twMerge("flex items-center gap-1.5", className)}>
      <span className="text-text-tertiary text-xs">#</span>
      <span className="text-accent-amber text-xs font-bold">{rank}</span>
    </div>
  );
}

interface TableRowLeaderboardScoreProps {
  score: number;
  className?: string;
}

function TableRowLeaderboardScore({
  score,
  className,
}: TableRowLeaderboardScoreProps) {
  return (
    <div className={twMerge("flex items-center gap-1.5", className)}>
      <span className="text-text-tertiary text-xs">score:</span>
      <span className="text-accent-red text-xs font-bold">
        {score.toFixed(1)}
      </span>
    </div>
  );
}

interface TableRowLeaderboardLanguageProps {
  language: string;
  className?: string;
}

function TableRowLeaderboardLanguage({
  language,
  className,
}: TableRowLeaderboardLanguageProps) {
  return (
    <span className={twMerge("text-text-secondary text-xs", className)}>
      {language}
    </span>
  );
}

interface TableRowLeaderboardLineCountProps {
  lineCount: number;
  className?: string;
}

function TableRowLeaderboardLineCount({
  lineCount,
  className,
}: TableRowLeaderboardLineCountProps) {
  return (
    <span className={twMerge("text-text-tertiary text-xs", className)}>
      {lineCount} lines
    </span>
  );
}

interface TableRowLeaderboardCodeProps {
  codeLines: string[];
  lineCount: number;
  className?: string;
}

function TableRowLeaderboardCode({
  codeLines,
  lineCount,
  className,
}: TableRowLeaderboardCodeProps) {
  const lineNumbers = Array.from({ length: lineCount }, (_, i) => i + 1);

  return (
    <div
      className={twMerge("h-[120px] flex overflow-auto bg-bg-input", className)}
    >
      {/* Line Numbers */}
      <div className="w-10 shrink-0 bg-bg-surface border-r border-border-primary">
        <div className="flex flex-col gap-1.5 py-3.5 px-2.5">
          {lineNumbers.map((num) => (
            <span
              key={num}
              className="font-mono text-xs text-text-tertiary text-right leading-5"
            >
              {num}
            </span>
          ))}
        </div>
      </div>

      {/* Code Content */}
      <div className="flex-1 flex flex-col gap-1.5 p-3.5 pl-4 overflow-auto">
        {codeLines.map((line) => (
          <span
            key={line}
            className={`font-mono text-xs leading-5 ${
              line.startsWith("//") || line.startsWith("--")
                ? "text-text-tertiary"
                : "text-text-secondary"
            }`}
          >
            {line}
          </span>
        ))}
      </div>
    </div>
  );
}

const TableRowLeaderboard = Object.assign(TableRowLeaderboardRoot, {
  Meta: TableRowLeaderboardMeta,
  Rank: TableRowLeaderboardRank,
  Score: TableRowLeaderboardScore,
  Language: TableRowLeaderboardLanguage,
  LineCount: TableRowLeaderboardLineCount,
  Code: TableRowLeaderboardCode,
});

export {
  TableRowLeaderboard,
  TableRowLeaderboardRoot,
  TableRowLeaderboardMeta,
  TableRowLeaderboardRank,
  TableRowLeaderboardScore,
  TableRowLeaderboardLanguage,
  TableRowLeaderboardLineCount,
  TableRowLeaderboardCode,
};

export type {
  TableRowLeaderboardMetaProps,
  TableRowLeaderboardRankProps,
  TableRowLeaderboardScoreProps,
  TableRowLeaderboardLanguageProps,
  TableRowLeaderboardLineCountProps,
  TableRowLeaderboardCodeProps,
};
