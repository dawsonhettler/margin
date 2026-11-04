import { createBrowserClient } from "@supabase/ssr";

export const createClient = () => {
  // Guard against server-side rendering execution
  if (typeof window === "undefined") {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!url || !key) {
    return null;
  }

  return createBrowserClient(url, key);
};
