export function OGFallback() {
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
      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
        <span style={{ color: "#10B981", fontSize: 24, fontWeight: 700 }}>
          &gt;
        </span>
        <span style={{ color: "#FAFAFA", fontSize: 20, fontWeight: 500 }}>
          devroast
        </span>
      </div>
      <span style={{ color: "#EF4444", fontSize: 48, fontWeight: 700 }}>
        404
      </span>
      <span style={{ color: "#737373", fontSize: 20 }}>Roast not found</span>
    </div>
  );
}
