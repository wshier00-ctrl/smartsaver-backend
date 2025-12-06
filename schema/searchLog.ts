import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const searchLogs = pgTable("search_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: text("user_id"),
  query: text("query").notNull(),
  productId: uuid("product_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
