import type { Roast } from "@/db/schema";

interface RoastImageProps {
  roast: Roast;
}

function getSeverityColor(score: number): string {
  if (score < 3) return "#EF4444"; // red
  if (score < 6) return "#F59E0B"; // amber
  return "#10B981"; // green
}

export function RoastImage({ roast }: RoastImageProps) {
  const scoreColor = getSeverityColor(roast.score);

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        backgroundColor: "#0A0A0A",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: 64,
        gap: 28,
        fontFamily: "Geist, sans-serif",
      }}
    >
      {/* Logo Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
          &gt;
        </span>
        <span style={{ color: "#FAFAFA", fontSize: 20, fontWeight: 500 }}>
          devroast
        </span>
      </div>

      {/* Score Row */}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4 }}>
        <span
          style={{
            color: scoreColor,
            fontSize: 160,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {roast.score.toFixed(1)}
        </span>
        <span style={{ color: "#737373", fontSize: 56 }}>/10</span>
      </div>

      {/* Verdict Row */}
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <div
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            backgroundColor: scoreColor,
          }}
        />
        <span style={{ color: scoreColor, fontSize: 20 }}>{roast.verdict}</span>
      </div>

      {/* Info */}
      <span
        style={{
          color: "#737373",
          fontSize: 16,
          fontFamily: "Geist Mono, monospace",
        }}
      >
        lang: {roast.language} · {roast.lineCount} lines
      </span>

      {/* Quote */}
      <span
        style={{
          color: "#FAFAFA",
          fontSize: 22,
          textAlign: "center",
          maxWidth: 800,
        }}
      >
        &ldquo;{roast.roastQuote}&rdquo;
      </span>
    </div>
  );
}
