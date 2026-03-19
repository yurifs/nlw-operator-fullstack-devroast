import { HomeLeaderboardSkeleton } from "../home-leaderboard-skeleton";

export default function LeaderboardLoading() {
  return (
    <main className="flex flex-col items-center min-h-screen bg-bg-page">
      <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
            <span className="text-accent-green text-3xl font-bold">{">"}</span>
            <h1 className="text-text-primary text-3xl font-bold">
              shame_leaderboard
            </h1>
          </div>
          <p className="text-text-secondary text-sm">
            {`// the most roasted code on the internet`}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <span className="bg-bg-elevated animate-pulse rounded h-4 w-32" />
            <span className="text-text-tertiary text-xs">·</span>
            <span className="bg-bg-elevated animate-pulse rounded h-4 w-24" />
          </div>
        </div>

        <div className="flex flex-col gap-4">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="border border-border-primary rounded-md overflow-hidden"
            >
              <div className="flex items-center justify-between h-12 px-5 bg-bg-surface border-b border-border-primary">
                <div className="flex items-center gap-4">
                  <span className="font-mono text-sm text-text-tertiary">
                    #{i + 1}
                  </span>
                  <span className="bg-bg-elevated animate-pulse rounded h-4 w-16" />
                </div>
                <div className="flex items-center gap-3">
                  <span className="bg-bg-elevated animate-pulse rounded h-4 w-20" />
                  <span className="bg-bg-elevated animate-pulse rounded h-4 w-16" />
                </div>
              </div>

              <div className="p-5">
                <div className="flex gap-4">
                  <div className="w-10 shrink-0 space-y-1">
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-4" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-4" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-4" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-4" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-4" />
                  </div>
                  <div className="flex-1 space-y-1">
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-3/4" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-1/2" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-2/3" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-1/2" />
                    <span className="block bg-bg-elevated animate-pulse rounded h-3 w-3/4" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
