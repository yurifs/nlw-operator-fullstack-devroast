import Link from "next/link";
import { Suspense } from "react";
import { LeaderboardEntries } from "@/app/leaderboard-entries";
import { CodeEditor } from "@/components/code-editor";
import { HomeStats } from "@/components/home-stats";
import { HydrateClient } from "@/trpc/server";
import { HomeLeaderboardSkeleton } from "./home-leaderboard-skeleton";

export default async function Home() {
  return (
    <HydrateClient>
      <main className="flex flex-col items-center px-10 pt-20">
        <section className="flex flex-col items-center gap-3 text-center mb-8">
          <h1 className="flex items-center gap-3 text-4xl font-bold text-text-primary">
            <span className="text-accent-green">$</span>
            paste your code. get roasted.
          </h1>
          <p className="text-text-secondary text-sm">
            {"//"} drop your code below and we&apos;ll rate it — brutally honest
            or full roast mode
          </p>
        </section>

        <CodeEditor />

        <HomeStats />

        <div className="h-12" />

        <section className="w-full max-w-[960px] flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-accent-green text-sm font-bold">
                {"//"}
              </span>
              <span className="text-text-primary text-sm font-bold">
                shame_leaderboard
              </span>
            </div>
            <Link
              href="/leaderboard"
              className="px-3 py-1.5 border border-border-primary hover:bg-bg-elevated transition-colors"
            >
              <span className="text-text-secondary text-xs">
                $ view_all &gt;&gt;
              </span>
            </Link>
          </div>

          <p className="text-text-tertiary text-sm">
            {"//"} the worst code on the internet, ranked by shame
          </p>

          <Suspense fallback={<HomeLeaderboardSkeleton />}>
            <LeaderboardEntries limit={3} />
          </Suspense>
        </section>
      </main>
    </HydrateClient>
  );
}
