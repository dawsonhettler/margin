"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = createClient();
    if (supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/login`,
      });
      if (error) {
        setErrorMsg(error.message);
        setLoading(false);
        return;
      }
    }

    setSubmitted(true);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-6 selection:bg-white selection:text-black">
      <div className="w-full max-w-md border border-[#222222] bg-[#0A0A0A] p-8 sm:p-12">
        <div className="text-center pb-8 border-b border-[#222222] mb-8">
          <Link href="/" className="font-serif tracking-[0.35em] text-2xl font-light text-white uppercase block mb-2">
            MARGIN
          </Link>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">
            Credential Recovery Protocol
          </span>
        </div>

        {submitted ? (
          <div className="text-center space-y-4">
            <div className="border border-emerald-900 bg-emerald-950/30 text-emerald-300 p-4 text-xs font-mono">
              Password recovery dispatch transmitted. Check corporate inbox for cryptographic reset key.
            </div>
            <Link href="/auth/login" className="block text-xs uppercase tracking-widest text-white underline pt-4">
              Return to Authentication Portal
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5 text-xs font-sans">
            {errorMsg && (
              <div className="p-3 border border-red-900 bg-red-950/40 text-red-300 text-xs text-center font-mono">
                {errorMsg}
              </div>
            )}

            <div>
              <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
                Registered Executive Email
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

            <Button type="submit" variant="primary" size="md" className="w-full" disabled={loading}>
              {loading ? "Transmitting..." : "Send Reset Link"}
            </Button>

            <div className="text-center pt-4">
              <Link href="/auth/login" className="text-xs text-[#707070] hover:text-white uppercase tracking-wider">
                Cancel & Return
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
