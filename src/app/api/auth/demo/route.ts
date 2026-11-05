import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const origin = new URL(req.url).origin;
  
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

  // Fallback if Supabase credentials are missing locally
  if (!supabaseUrl || supabaseUrl.includes("your-project")) {
    return NextResponse.redirect(`${origin}/overview?demo=true`);
  }

  // Use service role or anon client to sign in the pre-configured sandbox demo account
  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "demo@margincapital.app",
    password: "MarginDemoPassword2026!",
  });

  if (error || !data.session) {
    // If demo account doesn't exist yet in Supabase, fallback to overview with mock sandbox cookie
    const res = NextResponse.redirect(`${origin}/overview?demo=true`);
    res.cookies.set("sb-demo-mode", "true", { path: "/" });
    return res;
  }

  // Redirect straight into the live financial cockpit
  return NextResponse.redirect(`${origin}/overview?demo=true`);
}
