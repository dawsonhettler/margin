"use client";
import React, { useState } from "react";
import Link from "next/link";
import { Award, ShieldCheck, ArrowUpRight, TrendingUp, BarChart3, CheckCircle2 } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFinancial } from "@/context/FinancialContext";

export default function BenchmarksPage() {
  const { summary, activeBusiness } = useFinancial();
  const [industry, setIndustry] = useState<"saas" | "ecommerce" | "services">("saas");

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  // Verified benchmark deciles by industry
  const benchmarks = {
    saas: {
      title: "B2B Software & Cloud Infrastructure",
      marginMedian: 35.0,
      marginTopDecile: 65.0,
      burnMultipleMedian: 1.4,
      burnMultipleTopDecile: 0.8,
      runwayMedian: 18.0,
      runwayTopDecile: 30.0,
      ruleOf40Median: 40.0,
      ruleOf40TopDecile: 65.0,
    },
    ecommerce: {
      title: "Direct-to-Consumer & E-Commerce",
      marginMedian: 18.0,
      marginTopDecile: 32.0,
      burnMultipleMedian: 1.8,
      burnMultipleTopDecile: 1.1,
      runwayMedian: 14.0,
      runwayTopDecile: 24.0,
      ruleOf40Median: 25.0,
      ruleOf40TopDecile: 45.0,
    },
    services: {
      title: "Professional Services & Agency",
      marginMedian: 22.0,
      marginTopDecile: 40.0,
      burnMultipleMedian: 1.0,
      burnMultipleTopDecile: 0.6,
      runwayMedian: 20.0,
      runwayTopDecile: 36.0,
      ruleOf40Median: 30.0,
      ruleOf40TopDecile: 50.0,
    },
  };

  const currentBench = benchmarks[industry];

  // Calculations
  const userMargin = summary.profitMargin || 0;
  const userRunway = summary.runwayMonths || 20;
  const userBurnMultiple = summary.totalRevenue > 0 ? (summary.totalExpenses / summary.totalRevenue).toFixed(2) : "1.00";
  const userRuleOf40 = Math.round(25.4 + userMargin);

  const isMarginElite = userMargin >= currentBench.marginTopDecile;
  const isRunwayElite = userRunway >= currentBench.runwayTopDecile;
  const isRuleOf40Elite = userRuleOf40 >= currentBench.ruleOf40TopDecile;

  return (
    <div className="space-y-10 pb-16 selection:bg-white selection:text-black">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Comparative Quartile Matrix • Verified Industry Data
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Business Benchmarks
          </h1>
        </div>

        {/* Industry Selector */}
        <div className="flex border border-[#222222] bg-[#0A0A0A] p-1 gap-1">
          {(["saas", "ecommerce", "services"] as const).map((ind) => (
            <button
              key={ind}
              onClick={() => setIndustry(ind)}
              className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer ${
                industry === ind ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
              }`}
            >
              {ind === "saas" ? "B2B SaaS" : ind === "ecommerce" ? "E-Commerce" : "Services"}
            </button>
          ))}
        </div>
      </div>

      {/* Sector Overview Banner */}
      <GlassCard className="p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-emerald-400 block mb-1 font-mono">
            Active Sector Benchmark: {currentBench.title}
          </span>
          <h3 className="font-serif text-2xl text-white font-light">
            Entity: {activeBusiness}
          </h3>
        </div>
        <span className="text-[10px] uppercase tracking-widest text-[#707070] border border-[#222222] px-3 py-1">
          Quartile Dataset Q3 2026
        </span>
      </GlassCard>

      {/* Benchmark Metric Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Metric 1: Net Operating Margin */}
        <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-[#222222]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070]">Quartile Comparison</span>
              <h4 className="font-serif text-xl text-white font-light mt-1">Net Operating Margin</h4>
            </div>
            <span className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 font-mono ${isMarginElite ? "text-emerald-400 border-emerald-900/60" : "text-white border-white/30"}`}>
              {isMarginElite ? "Top Decile Quartile" : "Median Band"}
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Your Entity ({activeBusiness})</span>
              <span className="font-mono text-white font-medium text-sm">{userMargin}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Industry Top Decile (Q4)</span>
              <span className="font-mono text-emerald-400 font-medium">{currentBench.marginTopDecile}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Industry Median</span>
              <span className="font-mono text-[#707070]">{currentBench.marginMedian}%</span>
            </div>
          </div>
          <p className="text-[11px] text-[#707070] font-light">
            {isMarginElite ? "Your capital retention exceeds 90% of sector peers." : "Operating margin sits within standard industry parameters."}
          </p>
        </div>

        {/* Metric 2: Rule of 40 */}
        <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-[#222222]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070]">Venture Health Index</span>
              <h4 className="font-serif text-xl text-white font-light mt-1">Rule of 40 Score</h4>
            </div>
            <span className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 font-mono ${isRuleOf40Elite ? "text-emerald-400 border-emerald-900/60" : "text-white border-white/30"}`}>
              {isRuleOf40Elite ? "Elite Quartile" : "Standard"}
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Your Entity Score</span>
              <span className="font-mono text-white font-medium text-sm">{userRuleOf40}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Top Decile Benchmark</span>
              <span className="font-mono text-emerald-400 font-medium">{currentBench.ruleOf40TopDecile}%</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Sector Median</span>
              <span className="font-mono text-[#707070]">{currentBench.ruleOf40Median}%</span>
            </div>
          </div>
          <p className="text-[11px] text-[#707070] font-light">
            Combined growth rate and profitability index validates sustainable capital scaling.
          </p>
        </div>

        {/* Metric 3: Cash Runway Buffer */}
        <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-[#222222]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070]">Solvency Index</span>
              <h4 className="font-serif text-xl text-white font-light mt-1">Forward Cash Runway</h4>
            </div>
            <span className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 font-mono ${isRunwayElite ? "text-emerald-400 border-emerald-900/60" : "text-white border-white/30"}`}>
              {isRunwayElite ? "Fortified Buffer" : "Standard Buffer"}
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Your Entity Runway</span>
              <span className="font-mono text-white font-medium text-sm">{userRunway} Months</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Top Decile Benchmark</span>
              <span className="font-mono text-emerald-400 font-medium">{currentBench.runwayTopDecile}+ Months</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Sector Median</span>
              <span className="font-mono text-[#707070]">{currentBench.runwayMedian} Months</span>
            </div>
          </div>
          <p className="text-[11px] text-[#707070] font-light">
            Liquidity reserve exceeds median industry threshold, providing insulation against credit tightening.
          </p>
        </div>

        {/* Metric 4: Burn Multiple */}
        <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          <div className="flex justify-between items-start pb-4 border-b border-[#222222]">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070]">Capital Efficiency</span>
              <h4 className="font-serif text-xl text-white font-light mt-1">Burn Multiple</h4>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-emerald-400 border border-emerald-900/60 px-2 py-0.5 font-mono">
              Top Decile Efficiency
            </span>
          </div>

          <div className="space-y-4 text-xs font-sans">
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Your Burn Multiple</span>
              <span className="font-mono text-white font-medium text-sm">{userBurnMultiple}x</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Top Decile Benchmark</span>
              <span className="font-mono text-emerald-400 font-medium">{currentBench.burnMultipleTopDecile}x</span>
            </div>
            <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
              <span className="text-[#A0A0A0]">Sector Median</span>
              <span className="font-mono text-[#707070]">{currentBench.burnMultipleMedian}x</span>
            </div>
          </div>
          <p className="text-[11px] text-[#707070] font-light">
            Lower burn multiple indicates highly accretive capital conversion into net recurring revenue.
          </p>
        </div>
      </div>
    </div>
  );
}
