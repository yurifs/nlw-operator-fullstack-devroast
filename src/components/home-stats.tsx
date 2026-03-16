"use client";

import NumberFlow from "@number-flow/react";
import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function HomeStats() {
  const trpc = useTRPC();
  const { data } = useQuery(trpc.roast.getStats.queryOptions());

  const totalRoasts = data?.totalRoasts ?? 0;
  const avgScore = data?.avgScore ?? 0;

  return (
    <section className="w-full flex items-center justify-center gap-6 text-text-tertiary text-xs mb-8">
      <span>
        <NumberFlow value={totalRoasts} format={{ notation: "compact" }} />{" "}
        codes roasted
      </span>
      <span>·</span>
      <span>
        avg score:{" "}
        <NumberFlow
          value={avgScore}
          format={{ minimumFractionDigits: 1, maximumFractionDigits: 1 }}
        />
        /10
      </span>
    </section>
  );
}
