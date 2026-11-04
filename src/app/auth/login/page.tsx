"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = createClient();
    if (!supabase) {
      // Local dev mode fallback
      setTimeout(() => {
        router.push("/overview");
      }, 400);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/overview");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-6 selection:bg-white selection:text-black">
      <div className="w-full max-w-md border border-[#222222] bg-[#0A0A0A] p-8 sm:p-12">
        {/* Header */}
        <div className="text-center pb-8 border-b border-[#222222] mb-8">
          <Link href="/" className="font-serif tracking-[0.35em] text-2xl font-light text-white uppercase block mb-2">
            MARGIN
          </Link>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">
            Executive Authentication Portal
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 border border-red-900 bg-red-950/40 text-red-300 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5 text-xs font-sans">
          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
              Executive Email
            </label>
            <input
              type="email"
              required
              placeholder="principal@entity.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-[#222222] px-3.5 py-2.5 text-white placeholder-[#404040] focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1.5">
              <label className="uppercase text-[10px] tracking-widest text-[#707070]">
                Security Key
              </label>
              <a href="#" className="text-[10px] text-[#707070] hover:text-white uppercase tracking-wider">
                Reset
              </a>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black border border-[#222222] px-3.5 py-2.5 text-white placeholder-[#404040] focus:outline-none focus:border-white"
            />
          </div>

          <div className="pt-2">
            <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
              {loading ? "Authenticating..." : "Access Entity Ledger"}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#222222] text-center text-xs text-[#707070]">
          <span>Unregistered entity? </span>
          <Link href="/auth/register" className="text-white underline hover:text-neutral-300">
            Provision Seat
          </Link>
        </div>
      </div>
    </div>
  );
}
