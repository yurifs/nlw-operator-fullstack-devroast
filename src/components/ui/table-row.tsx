import { twMerge } from "tailwind-merge";

interface TableRowRootProps {
  className?: string;
  children?: React.ReactNode;
}

function TableRowRoot({ className, children }: TableRowRootProps) {
  return (
    <div
      className={twMerge(
        "flex px-5 py-4 border-b border-border-primary",
        className,
      )}
    >
      {children}
    </div>
  );
}

interface TableRowRankProps {
  rank: number;
  className?: string;
}

function TableRowRank({ rank, className }: TableRowRankProps) {
  return (
    <span
      className={twMerge(
        "font-mono text-sm w-12",
        rank === 1 ? "text-accent-amber" : "text-text-tertiary",
        className,
      )}
    >
      {rank}
    </span>
  );
}

interface TableRowScoreProps {
  score: number;
  className?: string;
}

function TableRowScore({ score, className }: TableRowScoreProps) {
  return (
    <span
      className={twMerge(
        "font-mono text-sm font-bold w-16 text-accent-red",
        className,
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}

interface TableRowCodeProps {
  className?: string;
  children?: React.ReactNode;
}

function TableRowCode({ className, children }: TableRowCodeProps) {
  return (
    <div className={twMerge("flex flex-col gap-0.5 flex-1", className)}>
      {children}
    </div>
  );
}

interface TableRowLanguageProps {
  language: string;
  className?: string;
}

function TableRowLanguage({ language, className }: TableRowLanguageProps) {
  return (
    <span
      className={twMerge(
        "text-text-secondary font-mono text-sm w-24",
        className,
      )}
    >
      {language}
    </span>
  );
}

const TableRow = Object.assign(TableRowRoot, {
  Rank: TableRowRank,
  Score: TableRowScore,
  Code: TableRowCode,
  Language: TableRowLanguage,
});

export {
  TableRow,
  TableRowRoot,
  TableRowRank,
  TableRowScore,
  TableRowCode,
  TableRowLanguage,
};

export type {
  TableRowRootProps,
  TableRowRankProps,
  TableRowScoreProps,
  TableRowCodeProps,
  TableRowLanguageProps,
};
