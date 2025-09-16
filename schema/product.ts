import { pgTable, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const products = pgTable('products', {
  id: text('id').primaryKey(),
  title: text('title').notNull(),
  priceCents: integer('price_cents').notNull(),
  createdAt: timestamp('created_at').defaultNow()
});
