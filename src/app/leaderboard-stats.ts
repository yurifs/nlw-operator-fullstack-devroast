"use server";

import { cacheLife } from "next/cache";
import { caller } from "@/trpc/server";

export async function getLeaderboardStats() {
  "use cache";
  cacheLife({ stale: 3600, revalidate: 3600, expire: 3600 });

  return caller.roast.getStats();
}
