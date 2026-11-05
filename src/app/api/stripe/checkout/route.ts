import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const { tier, email } = await req.json();

    const origin = req.headers.get("origin") || "https://margincapital.vercel.app";

    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey || secretKey === "sk_test_build_placeholder" || secretKey.includes("your-stripe-secret")) {
      return NextResponse.json({
        url: `${origin}/overview?billing=mock_success`,
        notice: "Stripe key not configured. Mocking checkout success.",
      });
    }

    const isVenture = tier === "venture";
    const unitAmount = isVenture ? 48000 : 19000;
    const planName = isVenture ? "MARGIN Venture Partner Seat" : "MARGIN Principal Seat";

    const session = await stripe.checkout.sessions.create({
      billing_address_collection: "required",
      customer_email: email || undefined,
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: planName,
              description: isVenture
                ? "Full access to Gemini Copilot, Headcount Simulator, and Multi-Entity Ledgers."
                : "Single entity financial cockpit, cash runway forecasting, and P&L dossiers.",
            },
            unit_amount: unitAmount,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      mode: "subscription",
      // Bypass managed payments tax code requirement on dynamic line items
      managed_payments: { enabled: false } as any,
      success_url: `${origin}/overview?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/settings?canceled=true`,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error("Stripe Checkout Error:", error);
    return NextResponse.json(
      { error: error?.message || "Failed to initialize Stripe checkout" },
      { status: 500 }
    );
  }
}
