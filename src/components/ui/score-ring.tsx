import { tv } from "tailwind-variants";

const scoreRing = tv({
  base: ["relative inline-flex items-center justify-center w-44 h-44"],
});

export interface ScoreRingProps {
  score: number;
  maxScore?: number;
  className?: string;
}

export function ScoreRing({ score, maxScore = 10, className }: ScoreRingProps) {
  const percentage = Math.min(score / maxScore, 1);
  const circumference = 2 * Math.PI * 40;
  const strokeDashoffset = circumference - percentage * circumference;

  const scoreColor =
    score >= 7
      ? "text-accent-green"
      : score >= 4
        ? "text-accent-amber"
        : "text-accent-red";

  return (
    <div className={scoreRing({ className })}>
      <svg
        className="absolute w-full h-full -rotate-90"
        viewBox="0 0 100 100"
        aria-label={`Score: ${score} out of ${maxScore}`}
      >
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="var(--color-border-primary)"
          strokeWidth="4"
        />
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="none"
          stroke="url(#scoreGradient)"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke-dashoffset 0.5s ease-out",
          }}
        />
        <defs>
          <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="var(--color-accent-red)" />
            <stop offset="35%" stopColor="var(--color-accent-amber)" />
            <stop offset="35%" stopColor="var(--color-accent-green)" />
          </linearGradient>
        </defs>
      </svg>
      <div className="flex items-center gap-0.5">
        <span className={`text-5xl font-bold font-mono ${scoreColor}`}>
          {score.toFixed(1)}
        </span>
        <span className="font-mono text-text-tertiary">/{maxScore}</span>
      </div>
    </div>
  );
}
