"use client";
import React from "react";
import Link from "next/link";
import { Lock, Zap, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface PaywallGateProps {
  featureName: string;
  requiredTier?: string;
  children: React.ReactNode;
  isLocked?: boolean; // Toggle this based on subscription status from Supabase
}

export const PaywallGate: React.FC<PaywallGateProps> = ({
  featureName,
  requiredTier = "Venture Partner ($480/mo)",
  children,
  isLocked = false, // Set to true to enforce paywall on trial accounts
}) => {
  if (!isLocked) {
    return <>{children}</>;
  }

  return (
    <div className="relative overflow-hidden border border-white/10 bg-[#0A0A0A] p-8 sm:p-12 text-center space-y-6">
      {/* Blurred background teaser */}
      <div className="filter blur-md opacity-25 pointer-events-none select-none space-y-4">
        <div className="h-8 bg-white/20 w-1/3 mx-auto"></div>
        <div className="h-48 bg-white/10 w-full"></div>
      </div>

      {/* Paywall Overlay */}
      <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 sm:p-10 space-y-4">
        <div className="w-10 h-10 border border-white/20 bg-white/[0.05] flex items-center justify-center text-white mb-2">
          <Lock size={18} />
        </div>
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 font-sans">
          Restricted Institutional Module
        </span>
        <h3 className="font-serif text-3xl text-white font-light">
          {featureName} Requires {requiredTier}
        </h3>
        <p className="text-xs text-neutral-400 font-light max-w-md leading-relaxed">
          This advanced intelligence module is restricted to active subscribers. Upgrade your entity credentials to unlock deterministic scenario modeling and AI analytics.
        </p>
        <div className="pt-4">
          <Link href="/settings">
            <Button variant="primary" size="sm">
              <span>Manage Billing & Upgrade</span>
              <ArrowRight size={13} className="ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};
