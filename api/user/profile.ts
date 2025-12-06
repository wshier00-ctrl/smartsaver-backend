import type { VercelRequest, VercelResponse } from "@vercel/node";
import { getUserFromRequest } from "../../lib/auth";

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const user = await getUserFromRequest(req);
    return res.status(200).json({ ok: true, user });
  } catch (error: any) {
    console.error("Profile error:", error);
    return res.status(500).json({ error: "Profile failed" });
  }
}
