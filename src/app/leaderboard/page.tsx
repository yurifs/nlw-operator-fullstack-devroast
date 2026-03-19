import { LeaderboardEntries } from "@/app/leaderboard-entries";
import { getLeaderboardStats } from "@/app/leaderboard-stats";
import { HydrateClient } from "@/trpc/server";

export const metadata = {
  title: "Shame Leaderboard | DevRoast",
  description: "The most roasted code on the internet - ranked by shame",
};

export default async function LeaderboardPage() {
  const stats = await getLeaderboardStats();

  return (
    <HydrateClient>
      <main className="flex flex-col items-center min-h-screen bg-bg-page">
        <section className="flex flex-col gap-10 w-full max-w-[1440px] px-20 py-10">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <span className="text-accent-green text-3xl font-bold">
                {">"}
              </span>
              <h1 className="text-text-primary text-3xl font-bold">
                shame_leaderboard
              </h1>
            </div>
            <p className="text-text-secondary text-sm">
              {`// the most roasted code on the internet`}
            </p>

            <div className="flex items-center gap-2 mt-2">
              <span className="text-text-tertiary text-xs">
                {`${stats.totalRoasts.toLocaleString()} submissions`}
              </span>
              <span className="text-text-tertiary text-xs">·</span>
              <span className="text-text-tertiary text-xs">
                {`avg score: ${stats.avgScore?.toFixed(1) ?? "0.0"}/10`}
              </span>
            </div>
          </div>

          <LeaderboardEntries limit={20} />
        </section>
      </main>
    </HydrateClient>
  );
}
