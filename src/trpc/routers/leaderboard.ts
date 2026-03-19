import { asc, count } from "drizzle-orm";
import { z } from "zod";
import { roasts } from "@/db/schema";
import { baseProcedure, createTRPCRouter } from "../init";

export const leaderboardRouter = createTRPCRouter({
  list: baseProcedure
    .input(
      z
        .object({
          limit: z.number().min(1).max(100).default(20),
          offset: z.number().min(0).default(0),
        })
        .optional(),
    )
    .query(async ({ ctx, input }) => {
      const limit = input?.limit ?? 20;
      const offset = input?.offset ?? 0;

      const entries = await ctx.db
        .select()
        .from(roasts)
        .orderBy(asc(roasts.score))
        .limit(limit)
        .offset(offset);

      return entries;
    }),

  getLeaderboard: baseProcedure
    .input(z.object({ limit: z.number().min(1).max(100).default(20) }))
    .query(async ({ ctx, input }) => {
      const selectedFields = {
        id: roasts.id,
        score: roasts.score,
        language: roasts.language,
        code: roasts.code,
        lineCount: roasts.lineCount,
      };

      type LeaderboardEntry = {
        id: string;
        score: number;
        language: string;
        code: string;
        lineCount: number;
      };

      const [entries, [{ totalCount }]] = await Promise.all([
        ctx.db
          .select(selectedFields)
          .from(roasts)
          .orderBy(asc(roasts.score))
          .limit(input.limit),
        ctx.db.select({ totalCount: count() }).from(roasts),
      ]);

      return {
        entries: entries as LeaderboardEntry[],
        totalCount,
      };
    }),
});
