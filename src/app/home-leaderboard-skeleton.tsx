export function HomeLeaderboardSkeleton() {
  return (
    <>
      <div className="flex flex-col gap-4">
        {[0, 1, 2].map((i) => (
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
                </div>
                <div className="flex-1 space-y-1">
                  <span className="block bg-bg-elevated animate-pulse rounded h-3 w-3/4" />
                  <span className="block bg-bg-elevated animate-pulse rounded h-3 w-1/2" />
                  <span className="block bg-bg-elevated animate-pulse rounded h-3 w-2/3" />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-center py-4">
        <span className="bg-bg-elevated animate-pulse rounded h-4 w-48" />
      </div>
    </>
  );
}
