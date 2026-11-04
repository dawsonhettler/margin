import Stripe from "stripe";

// Fallback dummy key prevents Stripe SDK from throwing during Next.js build-time data collection
export const stripe = new Stripe(
  process.env.STRIPE_SECRET_KEY || "sk_test_build_placeholder",
  {
    apiVersion: "2024-12-18.acacia" as any,
    typescript: true,
  }
);
