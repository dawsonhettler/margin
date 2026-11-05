"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { Sliders, RefreshCw, TrendingUp, Users, Tag, Megaphone, DollarSign, ShieldCheck } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFinancial } from "@/context/FinancialContext";

export default function SimulatorPage() {
  const { summary } = useFinancial();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  // -------------------------------------------------------------------------
  // MULTI-VARIABLE SIMULATOR STATE
  // -------------------------------------------------------------------------
  const [revGrowthPct, setRevGrowthPct] = useState(12); // +12% MoM
  const [priceAdjustmentPct, setPriceAdjustmentPct] = useState(0); // 0% price change
  const [newHires, setNewHires] = useState(1); // 1 new hire
  const [avgSalary, setAvgSalary] = useState(120000); // $120k/yr
  const [adSpendDelta, setAdSpendDelta] = useState(2000); // +$2,000/mo ad spend
  const [opexInflationPct, setOpexInflationPct] = useState(3); // 3% baseline opex inflation

  // Baseline Run-rates
  const baseRev = summary.totalRevenue > 0 ? summary.totalRevenue / 3 : 25000;
  const baseExp = summary.totalExpenses > 0 ? summary.totalExpenses / 3 : 15000;

  // -------------------------------------------------------------------------
  // DYNAMIC SIMULATION MATH
  // -------------------------------------------------------------------------
  const simulationResults = useMemo(() => {
    const monthlyPayrollAdd = (newHires * (avgSalary * 1.15)) / 12;
    const monthlyAdAdd = adSpendDelta;
    const baselineNet = baseRev - baseExp;

    // Simulated 12-month trajectory
    const curve = [];
    let baseCash = summary.cashPosition || 600000;
    let simCash = summary.cashPosition || 600000;

    let currentSimRev = baseRev * (1 + priceAdjustmentPct / 100);
    let currentSimExp = baseExp + monthlyPayrollAdd + monthlyAdAdd;

    const monthLabels = ["Now", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];

    for (let m = 0; m <= 12; m++) {
      if (m > 0) {
        baseCash += (baseRev - baseExp);
        currentSimRev *= (1 + revGrowthPct / 100 / 12);
        currentSimExp *= (1 + opexInflationPct / 100 / 12);
        simCash += (currentSimRev - currentSimExp);
      }
      curve.push({
        month: monthLabels[m],
        Baseline: Math.round(baseCash),
        Simulated: Math.round(simCash),
      });
    }

    const simMonthlyRev = currentSimRev;
    const simMonthlyExp = currentSimExp;
    const simMonthlyNet = simMonthlyRev - simMonthlyExp;
    const netMonthlyDelta = simMonthlyNet - baselineNet;

    const simRunway = simMonthlyExp > 0 ? parseFloat(((summary.cashPosition || 600000) / simMonthlyExp).toFixed(1)) : 36;
    const runwayDelta = parseFloat((simRunway - (summary.runwayMonths || 20)).toFixed(1));

    return {
      curve,
      simMonthlyRev,
      simMonthlyExp,
      simMonthlyNet,
      netMonthlyDelta,
      simRunway,
      runwayDelta,
    };
  }, [summary, revGrowthPct, priceAdjustmentPct, newHires, avgSalary, adSpendDelta, opexInflationPct, baseRev, baseExp]);

  const handleReset = () => {
    setRevGrowthPct(12);
    setPriceAdjustmentPct(0);
    setNewHires(1);
    setAvgSalary(120000);
    setAdSpendDelta(2000);
    setOpexInflationPct(3);
  };

  return (
    <div className="space-y-10 pb-16 selection:bg-white selection:text-black">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Multi-Variable Modeling • Real-Time Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Advanced Business Simulator
          </h1>
        </div>

        <button
          onClick={handleReset}
          className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#707070] hover:text-white border border-[#222222] bg-[#0A0A0A] px-3.5 py-2 transition-colors cursor-pointer self-start sm:self-auto"
        >
          <RefreshCw size={12} />
          <span>Reset Parameters</span>
        </button>
      </div>

      {/* Simulator Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Multi-Variable Sliders & Controls (5 Cols) */}
        <div className="lg:col-span-5 border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#222222] flex justify-between items-center">
            <div className="flex items-center space-x-2">
              <Sliders size={14} className="text-white" />
              <span className="text-[10px] tracking-[0.25em] uppercase text-white font-medium">
                Simulation Variables
              </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-[#707070] font-mono">
              Live Engine Active
            </span>
          </div>

          {/* 1. Revenue Growth MoM */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A0A0A0] uppercase tracking-wider text-[10px]">Top-Line Growth Velocity (MoM)</span>
              <span className="font-mono text-white text-sm">+{revGrowthPct}%</span>
            </div>
            <input
              type="range"
              min="-10"
              max="40"
              value={revGrowthPct}
              onChange={(e) => setRevGrowthPct(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer bg-[#222] h-1"
            />
          </div>

          {/* 2. Price Adjustment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A0A0A0] uppercase tracking-wider text-[10px]">Product Pricing Adjustment</span>
              <span className="font-mono text-white text-sm">{priceAdjustmentPct >= 0 ? "+" : ""}{priceAdjustmentPct}%</span>
            </div>
            <input
              type="range"
              min="-20"
              max="50"
              value={priceAdjustmentPct}
              onChange={(e) => setPriceAdjustmentPct(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer bg-[#222] h-1"
            />
          </div>

          {/* 3. Headcount Additions */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A0A0A0] uppercase tracking-wider text-[10px]">Planned Headcount Additions</span>
              <span className="font-mono text-white text-sm">+{newHires} Staff</span>
            </div>
            <input
              type="range"
              min="0"
              max="10"
              value={newHires}
              onChange={(e) => setNewHires(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer bg-[#222] h-1"
            />
          </div>

          {/* 4. Advertising Increment */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A0A0A0] uppercase tracking-wider text-[10px]">Incremental Ad Spend / mo</span>
              <span className="font-mono text-white text-sm">{formatCur(adSpendDelta)}</span>
            </div>
            <input
              type="range"
              min="0"
              max="20000"
              step="500"
              value={adSpendDelta}
              onChange={(e) => setAdSpendDelta(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer bg-[#222] h-1"
            />
          </div>

          {/* 5. OpEx Inflation */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs">
              <span className="text-[#A0A0A0] uppercase tracking-wider text-[10px]">Operating Expense Inflation</span>
              <span className="font-mono text-white text-sm">+{opexInflationPct}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="20"
              value={opexInflationPct}
              onChange={(e) => setOpexInflationPct(parseInt(e.target.value))}
              className="w-full accent-white cursor-pointer bg-[#222] h-1"
            />
          </div>

          <div className="pt-4 border-t border-[#1c1c1c] text-[11px] text-[#707070] font-light">
            Adjusting parameters updates all calculations and forward trajectory curves instantly without page reloading.
          </div>
        </div>

        {/* Right Column: Comparative Matrix & Visual Canvas (7 Cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Side-by-Side Matrix */}
          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
            <div className="pb-4 mb-6 border-b border-[#222222] flex justify-between items-center">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">
                  Comparative Simulation Output
                </span>
                <h3 className="font-serif text-2xl text-white font-light mt-1">
                  Baseline vs. Simulated Performance
                </h3>
              </div>
              <span className={`text-xs font-mono uppercase ${simulationResults.netMonthlyDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                Net Delta: {simulationResults.netMonthlyDelta >= 0 ? "+" : ""}{formatCur(simulationResults.netMonthlyDelta)}/mo
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 pb-6 border-b border-[#1c1c1c] text-center">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Current Baseline</span>
                <span className="font-mono text-sm text-[#A0A0A0] block">Rev: {formatCur(baseRev)}/mo</span>
                <span className="font-mono text-sm text-[#A0A0A0] block">Exp: {formatCur(baseExp)}/mo</span>
                <span className="font-mono text-sm text-white font-medium block mt-1">Net: {formatCur(baseRev - baseExp)}/mo</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-white block mb-1">Simulated State</span>
                <span className="font-mono text-sm text-white block">Rev: {formatCur(simulationResults.simMonthlyRev)}/mo</span>
                <span className="font-mono text-sm text-white block">Exp: {formatCur(simulationResults.simMonthlyExp)}/mo</span>
                <span className="font-mono text-sm text-emerald-400 font-medium block mt-1">Net: {formatCur(simulationResults.simMonthlyNet)}/mo</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Variance (Δ)</span>
                <span className={`font-mono text-sm block ${simulationResults.simMonthlyRev >= baseRev ? "text-emerald-400" : "text-red-400"}`}>
                  {simulationResults.simMonthlyRev >= baseRev ? "+" : ""}{formatCur(simulationResults.simMonthlyRev - baseRev)}
                </span>
                <span className="font-mono text-sm text-[#707070] block">+{formatCur(simulationResults.simMonthlyExp - baseExp)}</span>
                <span className={`font-mono text-sm font-medium block mt-1 ${simulationResults.netMonthlyDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {simulationResults.netMonthlyDelta >= 0 ? "+" : ""}{formatCur(simulationResults.netMonthlyDelta)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6 pt-6 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Simulated Runway</span>
                <div className="font-serif text-3xl text-white font-light">{simulationResults.simRunway} Mo</div>
                <span className={`text-[10px] font-mono mt-0.5 block ${simulationResults.runwayDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {simulationResults.runwayDelta >= 0 ? "+" : ""}{simulationResults.runwayDelta} Months Variance
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Capital Efficiency Status</span>
                <div className="font-serif text-2xl text-emerald-400 font-light mt-1">
                  {simulationResults.simMonthlyNet > 0 ? "Accretive Growth" : "Defensive Burn"}
                </div>
                <span className="text-[10px] font-mono text-[#707070] mt-0.5 block">
                  {simulationResults.simMonthlyNet > 0 ? "Generating net new cash" : "Drawing down reserves"}
                </span>
              </div>
            </div>
          </div>

          {/* Dynamic Visual Canvas */}
          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
            <div className="pb-4 mb-6 border-b border-[#222222] flex justify-between items-center">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Dynamic Projection Canvas</span>
                <h3 className="font-serif text-2xl text-white font-light mt-1">12-Month Reserve Trajectory Comparison</h3>
              </div>
            </div>

            {mounted && (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={simulationResults.curve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="simGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1c1c1c" vertical={false} strokeDasharray="2 2" />
                    <XAxis dataKey="month" stroke="#525252" tickLine={false} style={{ fontSize: "11px" }} />
                    <YAxis
                      stroke="#525252"
                      tickLine={false}
                      tickFormatter={(v) => `$${v / 1000}k`}
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#333", fontSize: "12px", color: "#fff" }}
                      formatter={(val: any) => [`$${val?.toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="Baseline" stroke="#707070" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} />
                    <Area type="monotone" dataKey="Simulated" stroke="#FFFFFF" strokeWidth={2} fill="url(#simGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex items-center space-x-6 pt-4 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-neutral-500 inline-block border-b border-dashed" />
                <span>Baseline Reserve Curve</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-white inline-block" />
                <span>Simulated Multi-Variable Curve</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
