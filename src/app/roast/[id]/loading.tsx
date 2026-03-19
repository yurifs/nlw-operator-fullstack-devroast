export default function RoastLoading() {
  return (
    <main className="flex flex-col items-center bg-bg-page min-h-[calc(100vh-3.5rem)]">
      <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
        <div className="flex items-center gap-12">
          <div className="w-[180px] h-[180px] rounded-full bg-bg-elevated animate-pulse" />
          <div className="flex flex-col gap-4 flex-1">
            <div className="w-40 h-4 bg-bg-elevated animate-pulse rounded" />
            <div className="w-3/4 h-8 bg-bg-elevated animate-pulse rounded" />
            <div className="w-32 h-4 bg-bg-elevated animate-pulse rounded" />
          </div>
        </div>

        <div className="h-px bg-border-primary" />

        <div className="flex flex-col gap-4">
          <div className="w-40 h-4 bg-bg-elevated animate-pulse rounded" />
          <div className="h-[200px] bg-bg-elevated animate-pulse rounded" />
        </div>

        <div className="h-px bg-border-primary" />

        <div className="flex flex-col gap-6">
          <div className="w-40 h-4 bg-bg-elevated animate-pulse rounded" />
          <div className="grid grid-cols-2 gap-5">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[120px] bg-bg-elevated animate-pulse rounded"
              />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
