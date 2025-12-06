import type { VercelRequest, VercelResponse } from "@vercel/node";
import Stripe from "stripe";
import { getUserFromRequest } from "../../lib/auth";
import { getDb } from "../../lib/db";
import { users } from "../../schema/user";
import { eq } from "drizzle-orm";

function getStripeClient() {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("STRIPE_SECRET_KEY not set");
  }
  return new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: "2024-06-20"
  });
}

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const user = await getUserFromRequest(req);
  if (!user.id || !user.email) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  if (!process.env.STRIPE_PRICE_ID) {
    return res.status(500).json({ error: "STRIPE_PRICE_ID not configured" });
  }

  const stripe = getStripeClient();
  const db = getDb();

  try {
    const existing = await db
      .select()
      .from(users)
      .where(eq(users.id, user.id))
      .limit(1);

    let stripeCustomerId: string | undefined = existing[0]?.stripeCustomerId || undefined;

    if (!stripeCustomerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id
        }
      });
      stripeCustomerId = customer.id;

      await db
        .update(users)
        .set({ stripeCustomerId })
        .where(eq(users.id, user.id));
    }

    const frontendBase =
      process.env.FRONTEND_URL || "https://smartsaver-frontend.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: process.env.STRIPE_PRICE_ID as string,
          quantity: 1
        }
      ],
      customer: stripeCustomerId,
      success_url: `${frontendBase}/premium/success`,
      cancel_url: `${frontendBase}/premium/cancel`
    });

    return res.status(200).json({
      ok: true,
      url: session.url
    });
  } catch (error: any) {
    console.error("Stripe checkout error:", error);
    return res.status(500).json({
      error: "Stripe checkout creation failed",
      message: error?.message || "Unknown"
    });
  }
}
