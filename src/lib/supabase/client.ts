import { createBrowserClient } from "@supabase/ssr";

let browserClient: any = null;

export const createClient = () => {
  if (typeof window === "undefined") {
    return null;
  }

  if (browserClient) {
    return browserClient;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ||
    "";

  if (!url || !key) {
    return null;
  }

  // Cast options to any so TypeScript doesn't reject custom lock handler
  browserClient = (createBrowserClient as any)(url, key, {
    auth: {
      lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
        return await fn();
      },
    },
  });

  return browserClient;
};
