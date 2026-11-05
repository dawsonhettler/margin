"use client";
import React, { useState } from "react";
import { CreditCard, ShieldCheck, ArrowUpRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";

export default function SettingsPage() {
  const { activeBusiness, setActiveBusiness } = useFinancial();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleCheckout = async (tier: "principal" | "venture") => {
    setLoadingTier(tier);
    setErrorMsg("");

    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setErrorMsg(data.error || "Failed to generate Stripe checkout session.");
        setLoadingTier(null);
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Network error connecting to billing engine.");
      setLoadingTier(null);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl pb-16 selection:bg-white selection:text-black">
      {/* Title */}
      <div className="pb-6 border-b border-white/[0.08]">
        <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block font-sans">
          Governance & Subscription Architecture
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
          Entity Settings & Billing
        </h1>
      </div>

      {errorMsg && (
        <div className="p-4 border border-red-900 bg-red-950/40 text-red-300 text-xs font-mono">
          {errorMsg}
        </div>
      )}

      {/* 1. Subscription & Capital Access Card */}
      <div className="liquid-glass p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-white/[0.08] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CreditCard size={15} className="text-white" />
              <h3 className="font-serif text-2xl text-white font-light">Subscription & Capital Access</h3>
            </div>
            <p className="text-xs text-neutral-400 mt-1">
              Active plan: <strong className="text-white font-medium">Complimentary Enterprise Trial</strong> (14 Days Remaining)
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 border border-emerald-900/60 px-3 py-1 bg-emerald-950/20 self-start sm:self-auto">
            Trial Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Principal Tier */}
          <div className="border border-white/10 bg-black/60 p-6 flex flex-col justify-between space-y-6 backdrop-blur-md">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-neutral-500">Founders Plan</span>
              <h4 className="font-serif text-xl text-white font-light mt-1">Principal Seat</h4>
              <div className="mt-4 mb-2">
                <span className="font-serif text-4xl text-white">$190</span>
                <span className="text-xs text-neutral-500 ml-2 font-mono">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-white/[0.06]">
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-white shrink-0" />
                  <span>Single Entity General Ledger</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-white shrink-0" />
                  <span>Deterministic Runway Projections</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-white shrink-0" />
                  <span>GAAP Statement Dossier Exports</span>
                </li>
              </ul>
            </div>
            <Button
              variant="secondary"
              size="sm"
              className="w-full"
              disabled={loadingTier !== null}
              onClick={() => handleCheckout("principal")}
            >
              {loadingTier === "principal" ? "Redirecting to Stripe..." : "Subscribe to Principal ($190/mo)"}
            </Button>
          </div>

          {/* Venture Tier */}
          <div className="liquid-glass-elevated border-white/30 p-6 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex justify-between items-center">
                <span className="text-[10px] uppercase tracking-widest text-white">Scale & Growth</span>
                <span className="text-[9px] uppercase tracking-widest bg-white text-black px-2 py-0.5 font-medium">
                  Recommended
                </span>
              </div>
              <h4 className="font-serif text-xl text-white font-light mt-1">Venture Partner</h4>
              <div className="mt-4 mb-2">
                <span className="font-serif text-4xl text-white">$480</span>
                <span className="text-xs text-neutral-500 ml-2 font-mono">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-200 pt-4 border-t border-white/10">
                <li className="flex items-center space-x-2">
                  <Zap size={12} className="text-white shrink-0" />
                  <span>Gemini 3.8 Flash Financial Copilot</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-white shrink-0" />
                  <span>Headcount & Pricing Simulator</span>
                </li>
                <li className="flex items-center space-x-2">
                  <Check size={12} className="text-white shrink-0" />
                  <span>Multi-Entity Switching & Consolidation</span>
                </li>
              </ul>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="w-full"
              disabled={loadingTier !== null}
              onClick={() => handleCheckout("venture")}
            >
              {loadingTier === "venture" ? "Redirecting to Stripe..." : "Upgrade to Venture ($480/mo)"}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Platform Entity Configuration Card */}
      <div className="liquid-glass p-6 sm:p-8 space-y-6 text-xs font-sans">
        <h3 className="font-serif text-2xl text-white font-light pb-4 border-b border-white/[0.08]">
          Entity Preferences
        </h3>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-neutral-500 mb-1.5">
            Active Operating Entity
          </label>
          <input
            type="text"
            value={activeBusiness}
            onChange={(e) => setActiveBusiness(e.target.value)}
            className="w-full bg-black/80 border border-white/15 px-3.5 py-2.5 text-white text-xs focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-neutral-500 mb-1.5">
            Functional Accounting Currency
          </label>
          <select className="w-full bg-black/80 border border-white/15 px-3.5 py-2.5 text-white focus:outline-none cursor-pointer">
            <option>USD ($) — United States Dollar</option>
            <option>EUR (€) — Eurozone</option>
            <option>GBP (£) — British Pound</option>
            <option>CHF (Fr) — Swiss Franc</option>
          </select>
        </div>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-neutral-500 mb-1.5">
            Accounting Standard & Cadence
          </label>
          <div className="border border-white/10 p-3.5 text-neutral-300 text-xs bg-black/40">
            US-GAAP Deterministic Accrual Standard • Calendar Year Cadence
          </div>
        </div>

        <div className="pt-4 border-t border-white/[0.08]">
          <Button variant="primary" size="sm" onClick={() => alert("Preferences committed.")}>
            Save Entity Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
