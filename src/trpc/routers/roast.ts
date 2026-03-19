import { avg, count } from "drizzle-orm";
import { z } from "zod";
import { analysisItems, roasts, type verdictEnum } from "@/db/schema";
import { analyzeCodeWithTimeout } from "@/lib/groq";
import { baseProcedure, createTRPCRouter } from "../init";

type Verdict = (typeof verdictEnum.enumValues)[number];

interface GetStatsResult {
  totalRoasts: number;
  avgScore: number | null;
}

const verdictValues: readonly string[] = [
  "needs_serious_help",
  "rough_around_edges",
  "decent_code",
  "solid_work",
  "exceptional",
];

const severityValues = ["critical", "warning", "good"] as const;

const analysisItemSchema = z.object({
  severity: z.enum(severityValues),
  title: z.string().min(1).max(200),
  description: z.string().min(1),
});

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

  getById: baseProcedure
    .input(z.object({ id: z.string().uuid() }))
    .query(async ({ ctx, input }) => {
      const roast = await ctx.db.query.roasts.findFirst({
        where: (roasts, { eq }) => eq(roasts.id, input.id),
        with: {
          analysisItems: {
            orderBy: (items, { asc }) => [asc(items.order)],
          },
        },
      });

      return roast ?? null;
    }),

  create: baseProcedure
    .input(
      z.object({
        code: z.string().min(1).max(10000),
        language: z.string(),
        roastMode: z.boolean(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      let analysis;
      try {
        analysis = await analyzeCodeWithTimeout(
          input.code,
          input.language,
          input.roastMode,
        );
      } catch (error) {
        throw new Error(
          `Analysis failed: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
      }

      if (!analysis.analysis || analysis.analysis.length === 0) {
        throw new Error("Analysis must have at least 1 item");
      }

      const score = Math.min(10, Math.max(0, Number(analysis.score) || 5));

      const rawVerdict = analysis.verdict;
      const verdict: Verdict = verdictValues.includes(rawVerdict)
        ? (rawVerdict as Verdict)
        : "decent_code";

      const validAnalysis = analysis.analysis
        .slice(0, 10)
        .map((item, index) => {
          const parsed = analysisItemSchema.safeParse(item);
          if (parsed.success) {
            return { ...parsed.data, order: index };
          }
          return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

      if (validAnalysis.length === 0) {
        throw new Error("Analysis must have at least 1 valid item");
      }

      const [roast] = await ctx.db
        .insert(roasts)
        .values({
          code: input.code,
          language: input.language,
          lineCount: input.code.split("\n").length,
          roastMode: input.roastMode,
          score,
          verdict,
          roastQuote: analysis.roastQuote || "Code reviewed.",
          suggestedFix: analysis.suggestedFix || null,
        })
        .returning({ id: roasts.id });

      await ctx.db.insert(analysisItems).values(
        validAnalysis.map((item) => ({
          roastId: roast.id,
          severity: item.severity,
          title: item.title,
          description: item.description,
          order: item.order,
        })),
      );

      return { id: roast.id };
    }),
});
