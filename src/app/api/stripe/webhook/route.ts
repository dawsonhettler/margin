import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";
import { headers } from "next/headers";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("stripe-signature") as string;

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook signature verification failed: ${err.message}` }, { status: 400 });
  }

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const businessId = session.metadata?.business_id;

    if (businessId) {
      await supabaseAdmin
        .from("businesses")
        .update({ subscription_tier: session.metadata?.tier || "venture" })
        .eq("id", businessId);
    }
  }

  if (event.type === "customer.subscription.deleted") {
    const subscription = event.data.object as any;
    // Downgrade to free/trial on cancellation
    await supabaseAdmin
      .from("businesses")
      .update({ subscription_tier: "free" })
      .eq("id", subscription.metadata?.business_id);
  }

  return NextResponse.json({ received: true });
}
