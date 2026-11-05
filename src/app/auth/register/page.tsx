"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";

export default function RegisterPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const supabase = createClient();
    if (!supabase) {
      router.push("/onboarding");
      return;
    }

    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          full_name: fullName,
          business_name: businessName,
        },
      },
    });

    if (error) {
      setErrorMsg(error.message);
      setLoading(false);
    } else {
      router.push("/onboarding");
    }
  };

  return (
    <div className="min-h-screen bg-black flex flex-col justify-center items-center px-6 selection:bg-white selection:text-black py-16">
      <div className="w-full max-w-md border border-[#222222] bg-[#0A0A0A] p-8 sm:p-12">
        <div className="text-center pb-8 border-b border-[#222222] mb-8">
          <Link href="/" className="font-serif tracking-[0.35em] text-2xl font-light text-white uppercase block mb-2">
            MARGIN
          </Link>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">
            Provision Enterprise Intelligence Seat
          </span>
        </div>

        {errorMsg && (
          <div className="mb-6 p-3 border border-red-900 bg-red-950/40 text-red-300 text-xs text-center font-mono">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4 text-xs font-sans">
          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
              Executive Principal Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Alistair Vance"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full bg-black border border-[#222222] px-3.5 py-2.5 text-white placeholder-[#404040] focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
              Operating Company Name
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Atelier Capital Partners"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-black border border-[#222222] px-3.5 py-2.5 text-white placeholder-[#404040] focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
              Corporate Email
            </label>
            <input
              type="email"
              required
              placeholder="principal@atelier.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black border border-[#222222] px-3.5 py-2.5 text-white placeholder-[#404040] focus:outline-none focus:border-white"
            />
          </div>

          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
              Master Security Key
            </label>
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
              {loading ? "Provisioning..." : "Provision Intelligence Seat"}
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-[#222222] text-center text-xs text-[#707070]">
          <span>Already provisioned? </span>
          <Link href="/auth/login" className="text-white underline hover:text-neutral-300">
            Sign In
          </Link>
        </div>
      </div>
    </div>
  );
}
