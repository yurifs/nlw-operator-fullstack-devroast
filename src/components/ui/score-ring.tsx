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
    score < 3
      ? "text-accent-red"
      : score < 6
        ? "text-accent-amber"
        : "text-accent-green";

  const strokeColor =
    score < 3
      ? "var(--color-accent-red)"
      : score < 6
        ? "var(--color-accent-amber)"
        : "var(--color-accent-green)";

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
          stroke={strokeColor}
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          style={{
            transition: "stroke 0.3s ease-out, stroke-dashoffset 0.5s ease-out",
          }}
        />
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
