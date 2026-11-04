"use client";
import React, { useState } from "react";
import { CreditCard, ShieldCheck, ArrowUpRight, Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";

export default function SettingsPage() {
  const { activeBusiness, setActiveBusiness } = useFinancial();
  const [loadingTier, setLoadingTier] = useState<string | null>(null);

  const handleCheckout = async (tier: "principal" | "venture") => {
    setLoadingTier(tier);
    try {
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch {
      alert("Billing engine connection failure. Check Stripe keys.");
    } finally {
      setLoadingTier(null);
    }
  };

  return (
    <div className="space-y-10 max-w-4xl pb-16">
      {/* Title */}
      <div className="pb-6 border-b border-[#222222]">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
          Governance & Subscription Architecture
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
          Entity Settings & Billing
        </h1>
      </div>

      {/* 1. Subscription & Capital Access Card */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#222222] gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <CreditCard size={15} className="text-white" />
              <h3 className="font-serif text-2xl text-white font-light">Subscription & Capital Access</h3>
            </div>
            <p className="text-xs text-[#707070] mt-1">
              Active plan: <strong className="text-white">Complimentary Enterprise Trial</strong> (14 Days Remaining)
            </p>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-emerald-400 border border-emerald-900/60 px-3 py-1 self-start sm:self-auto">
            Trial Active
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          {/* Principal Tier */}
          <div className="border border-[#222222] bg-black p-6 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070]">Founders Plan</span>
              <h4 className="font-serif text-xl text-white font-light mt-1">Principal Seat</h4>
              <div className="mt-4 mb-2">
                <span className="font-serif text-4xl text-white">$190</span>
                <span className="text-xs text-[#707070] ml-2 font-mono">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-[#A0A0A0] pt-4 border-t border-[#1c1c1c]">
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
              disabled={loadingTier === "principal"}
              onClick={() => handleCheckout("principal")}
            >
              {loadingTier === "principal" ? "Redirecting to Stripe..." : "Subscribe to Principal ($190/mo)"}
            </Button>
          </div>

          {/* Venture Tier */}
          <div className="border border-white bg-[#121212] p-6 flex flex-col justify-between space-y-6">
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
                <span className="text-xs text-[#707070] ml-2 font-mono">/ month</span>
              </div>
              <ul className="space-y-2.5 text-xs text-neutral-200 pt-4 border-t border-[#262626]">
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
              disabled={loadingTier === "venture"}
              onClick={() => handleCheckout("venture")}
            >
              {loadingTier === "venture" ? "Redirecting to Stripe..." : "Upgrade to Venture ($480/mo)"}
            </Button>
          </div>
        </div>
      </div>

      {/* 2. Platform Entity Configuration Card */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6 text-xs font-sans">
        <h3 className="font-serif text-2xl text-white font-light pb-4 border-b border-[#222222]">
          Entity Preferences
        </h3>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
            Active Operating Entity
          </label>
          <input
            type="text"
            value={activeBusiness}
            onChange={(e) => setActiveBusiness(e.target.value)}
            className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
            Functional Accounting Currency
          </label>
          <select className="w-full bg-black border border-[#222222] px-3 py-2 text-white focus:outline-none cursor-pointer">
            <option>USD ($) — United States Dollar</option>
            <option>EUR (€) — Eurozone</option>
            <option>GBP (£) — British Pound</option>
            <option>CHF (Fr) — Swiss Franc</option>
          </select>
        </div>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
            Accounting Standard & Cadence
          </label>
          <div className="border border-[#222222] p-3 text-[#A0A0A0] text-xs">
            US-GAAP Deterministic Accrual Standard • Calendar Year Cadence
          </div>
        </div>

        <div className="pt-4 border-t border-[#222222]">
          <Button variant="primary" size="sm" onClick={() => alert("Preferences committed.")}>
            Save Entity Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
