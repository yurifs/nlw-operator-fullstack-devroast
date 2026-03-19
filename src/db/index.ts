import { drizzle } from "drizzle-orm/node-postgres";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

export const db = drizzle(databaseUrl, { schema, casing: "snake_case" });

export type DB = PostgresJsDatabase<typeof schema>;
