import { relations } from "drizzle-orm";
import {
  boolean,
  index,
  integer,
  pgEnum,
  pgTable,
  real,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const verdictEnum = pgEnum("verdict", [
  "needs_serious_help",
  "rough_around_edges",
  "decent_code",
  "solid_work",
  "exceptional",
]);

export const severityEnum = pgEnum("severity", ["critical", "warning", "good"]);

export const roasts = pgTable(
  "roasts",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: text("code").notNull(),
    language: varchar("language", { length: 50 }).notNull(),
    lineCount: integer("line_count").notNull(),
    roastMode: boolean("roast_mode").default(false).notNull(),
    score: real("score").notNull(),
    verdict: verdictEnum("verdict").notNull(),
    roastQuote: text("roast_quote"),
    suggestedFix: text("suggested_fix"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => [
    index("roasts_score_idx").on(table.score),
    index("roasts_created_at_idx").on(table.createdAt),
  ],
);

export const analysisItems = pgTable(
  "analysis_items",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    roastId: uuid("roast_id")
      .references(() => roasts.id, { onDelete: "cascade" })
      .notNull(),
    severity: severityEnum("severity").notNull(),
    title: varchar("title", { length: 200 }).notNull(),
    description: text("description").notNull(),
    order: integer("order").notNull(),
  },
  (table) => [index("analysis_items_roast_id_idx").on(table.roastId)],
);

export type Roast = typeof roasts.$inferSelect;
export type NewRoast = typeof roasts.$inferInsert;
export type AnalysisItem = typeof analysisItems.$inferSelect;
export type NewAnalysisItem = typeof analysisItems.$inferInsert;

export const roastsRelations = relations(roasts, ({ many }) => ({
  analysisItems: many(analysisItems),
}));

export const analysisItemsRelations = relations(analysisItems, ({ one }) => ({
  roast: one(roasts, {
    fields: [analysisItems.roastId],
    references: [roasts.id],
  }),
}));
