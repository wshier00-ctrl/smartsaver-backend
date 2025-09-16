import { drizzle } from 'drizzle-orm/node-postgres';
import { Pool } from 'pg';
import { products } from '../../schema/product';
import 'dotenv/config';

export const config = { runtime: 'nodejs' };

export default async function handler() {
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });
  const db = drizzle(pool);

  try {
    const rows = await db.select().from(products).limit(25);
    return new Response(JSON.stringify(rows), {
      headers: { 'content-type': 'application/json' },
      status: 200
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  } finally {
    await pool.end();
  }
}
