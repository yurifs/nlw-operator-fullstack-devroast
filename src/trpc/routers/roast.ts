import { avg, count } from "drizzle-orm";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

interface GetStatsResult {
  totalRoasts: number;
  avgScore: number | null;
}

export const roastRouter = createTRPCRouter({
  getStats: baseProcedure.query(async ({ ctx }): Promise<GetStatsResult> => {
    const [stats] = await ctx.db
      .select({
        totalRoasts: count(),
        avgScore: avg(roasts.score),
      })
      .from(roasts);

    return {
      totalRoasts: stats?.totalRoasts ?? 0,
      avgScore: stats?.avgScore != null ? Number(stats.avgScore) : null,
    };
  }),
});
