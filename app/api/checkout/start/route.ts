import { NextResponse } from "next/server";
import Stripe from "stripe";
import { redis } from "@/lib/redis"; // <- use your existing Upstash client

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // If this causes issues, remove the apiVersion line
  apiVersion: "2025-01-27.acacia",
});

type ReqBody = {
  productSlug: string;
  productName: string;
  pricePLN: number;
};

export async function POST(req: Request) {
  try {
    const { productSlug, productName, pricePLN } = (await req.json()) as ReqBody;

    if (!productSlug || !productName || typeof pricePLN !== "number") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const statusKey = `status:product:${productSlug}`;
    const lockKey = `lock:product:${productSlug}`;

    const status = await redis.get<string>(statusKey);
    if (status === "sold") {
      return NextResponse.json({ error: "Sold" }, { status: 409 });
    }

    // Acquire 15-min lock
    const locked = await redis.set(lockKey, "locked", { nx: true, ex: 15 * 60 });
    if (!locked) {
      return NextResponse.json({ error: "Reserved by another buyer" }, { status: 409 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL!;
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "pln",
            unit_amount: Math.round(pricePLN * 100),
            product_data: { name: productName },
          },
          quantity: 1,
        },
      ],
      shipping_address_collection: { allowed_countries: ["PL", "CZ", "DE", "SK", "AT"] },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/checkout/cancel?product=${encodeURIComponent(productSlug)}`,
      metadata: { productSlug },
    });

    // Store session id as lock value (helps debugging)
    await redis.set(lockKey, session.id, { xx: true, ex: 15 * 60 });

    return NextResponse.json({ url: session.url }, { status: 200 });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
