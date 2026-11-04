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

  // Universal lock handler supports both 2-argument and 3-argument calls from GoTrue
  browserClient = (createBrowserClient as any)(url, key, {
    auth: {
      lock: async (_name: string, acquireTimeoutOrCallback: any, maybeCallback?: any) => {
        const fn =
          typeof acquireTimeoutOrCallback === "function"
            ? acquireTimeoutOrCallback
            : maybeCallback;
        if (typeof fn === "function") {
          return await fn();
        }
      },
    },
  });

  return browserClient;
};
