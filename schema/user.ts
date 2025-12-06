import { pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  // Supabase user id (UUID string)
  id: text("id").primaryKey(),
  email: text("email").notNull(),
  role: text("role").notNull().default("free"), // "free" | "premium"
  stripeCustomerId: text("stripe_customer_id"),
  stripeSubscriptionId: text("stripe_subscription_id"),
  stripeStatus: text("stripe_status"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});
