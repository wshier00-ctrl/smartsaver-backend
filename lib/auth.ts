import type { VercelRequest } from "@vercel/node";
import { createClient } from "@supabase/supabase-js";
import { getDb } from "./db";
import { users } from "../schema/user";
import { eq } from "drizzle-orm";
import type { UserRole } from "./pricing";

export type AuthUser = {
  id: string | null;
  email: string | null;
  role: UserRole;
};

function getSupabaseAdminClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY not set");
  }
  return createClient(url, key);
}

export async function getUserFromRequest(
  req: VercelRequest
): Promise<AuthUser> {
  const authHeader = req.headers.authorization || req.headers.Authorization;
  const token =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader.substring("Bearer ".length)
      : null;

  if (!token) {
    return { id: null, email: null, role: "free" };
  }

  const supabase = getSupabaseAdminClient();
  const { data, error } = await supabase.auth.getUser(token);

  if (error || !data.user) {
    return { id: null, email: null, role: "free" };
  }

  const supabaseUser = data.user;
  const db = getDb();
  const email = supabaseUser.email || "unknown@example.com";

  const existing = await db
    .select()
    .from(users)
    .where(eq(users.id, supabaseUser.id))
    .limit(1);

  let role: UserRole = "free";

  if (existing.length === 0) {
    await db.insert(users).values({
      id: supabaseUser.id,
      email,
      role: "free"
    });
  } else {
    role = (existing[0].role as UserRole) || "free";
  }

  return {
    id: supabaseUser.id,
    email,
    role
  };
}
