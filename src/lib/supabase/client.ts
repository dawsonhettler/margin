import { createBrowserClient } from "@supabase/ssr";

let browserClient: any = null;

export const createClient = () => {
  if (typeof window === "undefined") {
    return null;
  }

  // Singleton instance prevents multiple GoTrueClients from colliding
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

  browserClient = createBrowserClient(url, key, {
    auth: {
      // Custom no-op lock to completely bypass the browser's buggy navigator.locks deadlock
      lock: async (_name: string, _acquireTimeout: number, fn: () => Promise<any>) => {
        return await fn();
      },
    },
  });

  return browserClient;
};
