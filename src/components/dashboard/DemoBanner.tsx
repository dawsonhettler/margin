"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, X } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export const DemoBanner: React.FC = () => {
  const [isDemo, setIsDemo] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser();
        // If a real user is signed in, never show the demo banner
        if (user) {
          setIsDemo(false);
          return;
        }
      }

      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "true" || document.cookie.includes("sb-demo-mode=true")) {
        setIsDemo(true);
      }
    }
    checkAuth();
  }, []);

  if (!isDemo || dismissed) return null;

  return (
    <div className="bg-white text-black px-4 py-2.5 text-xs font-sans flex items-center justify-between sticky top-16 z-30 border-b border-neutral-300">
      <div className="flex items-center space-x-2 mx-auto">
        <Sparkles size={14} className="text-black shrink-0" />
        <span className="font-medium uppercase tracking-wider text-[11px]">
          Sandbox Mode Active: You are exploring simulated financial intelligence.
        </span>
        <Link
          href="/auth/register"
          className="underline font-bold uppercase tracking-widest text-[11px] ml-2 hover:opacity-75 transition-opacity"
        >
          Claim Your Permanent Seat →
        </Link>
      </div>
      <button
        onClick={() => setDismissed(true)}
        className="text-neutral-500 hover:text-black transition-colors p-1 cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};
