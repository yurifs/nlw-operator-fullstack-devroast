import { initTRPC } from "@trpc/server";
import { cache } from "react";
import type { DB } from "@/db";
import { db } from "@/db";

export type Context = {
  db: DB;
};

export const createTRPCContext = cache(async (): Promise<Context> => {
  return { db };
});

const t = initTRPC.context<Context>().create();

export const createTRPCRouter = t.router;
export const createCallerFactory = t.createCallerFactory;
export const baseProcedure = t.procedure;
