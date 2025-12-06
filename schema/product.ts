import { pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  normalizedTitle: text("normalized_title"),
  brand: text("brand"),
  model: text("model"),
  upc: text("upc"),
  category: text("category"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});
