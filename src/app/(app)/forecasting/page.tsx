"use client";
import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { AlertTriangle, TrendingUp, Sliders, Shield, Zap, Lock, Grid } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export default function ForecastingPage() {
  const { summary } = useFinancial();
  const [mounted, setMounted] = useState(false);
  const [horizonMonths, setHorizonMonths] = useState(6);

  // Capital Defense Protocol State
  const [protocol, setProtocol] = useState<"defense" | "baseline" | "aggressive">("baseline");

  // Base parameters
  const [baseGrowth, setBaseGrowth] = useState(12);
  const [baseExpenseEscalation, setBaseExpenseEscalation] = useState(4);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Protocol modifier overrides
  const effectiveGrowth = protocol === "defense" ? baseGrowth - 5 : protocol === "aggressive" ? baseGrowth + 15 : baseGrowth;
  const effectiveExpense = protocol === "defense" ? 0 : protocol === "aggressive" ? baseExpenseEscalation + 8 : baseExpenseEscalation;

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const baseMonthlyRev = summary.totalRevenue > 0 ? summary.totalRevenue / 3 : 25000;
  const baseMonthlyExp = summary.totalExpenses > 0 ? summary.totalExpenses / 3 : 15000;

  // Generate 12-month forward trajectory
  const projectionData = [];
  let currentCash = summary.cashPosition;
  const monthNames = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 9", "Month 12"];

  for (let i = 1; i <= horizonMonths; i++) {
    const rev = baseMonthlyRev * Math.pow(1 + effectiveGrowth / 100, i);
    const exp = baseMonthlyExp * Math.pow(1 + effectiveExpense / 100, i);
    const net = rev - exp;
    currentCash += net;

    projectionData.push({
      period: monthNames[i - 1] || `M+${i}`,
      projectedRevenue: Math.round(rev),
      projectedExpenses: Math.round(exp),
      projectedCash: Math.round(currentCash),
    });
  }

  const endingCash = projectionData[projectionData.length - 1]?.projectedCash || 0;
  const netDelta = endingCash - summary.cashPosition;

  // ------------------------------------------------------------------
  // 2D RUNWAY SENSITIVITY MATRIX (5x5 GRID)
  // Rows: Revenue Growth (-15%, 0%, +10%, +25%, +40%)
  // Cols: Expense Inflation (0%, 5%, 10%, 20%, 30%)
  // ------------------------------------------------------------------
  const revGrowthScenarios = [-15, 0, 10, 25, 40];
  const expInflationScenarios = [0, 5, 10, 20, 30];

  const calculateRunwayCell = (g: number, e: number) => {
    let c = summary.cashPosition;
    let r = baseMonthlyRev;
    let x = baseMonthlyExp;
    for (let m = 1; m <= 60; m++) {
      r *= 1 + g / 100 / 12;
      x *= 1 + e / 100 / 12;
      c += r - x;
      if (c <= 0) return (m / 1.0).toFixed(1);
    }
    return ">48";
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Strategic Treasury • Forward Liquidity Matrix
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Forecasting & War Room
          </h1>
        </div>

        <div className="flex border border-[#222222] bg-[#0A0A0A] p-1">
          {[3, 6, 12].map((m) => (
            <button
              key={m}
              onClick={() => setHorizonMonths(m)}
              className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                horizonMonths === m ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
              }`}
            >
              {m} Months
            </button>
          ))}
        </div>
      </div>

      {/* 1. Capital Defense Protocols */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
        <div className="flex items-center space-x-2 pb-4 mb-6 border-b border-[#222222]">
          <Shield size={14} className="text-white" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-white font-medium">
            One-Click Operational Defense Protocols
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setProtocol("defense")}
            className={`p-5 text-left border transition-all cursor-pointer ${
              protocol === "defense"
                ? "border-emerald-500 bg-[#0F1E12] text-white"
                : "border-[#222222] bg-black text-[#707070] hover:border-[#404040]"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-emerald-400">DEFCON 1</span>
              {protocol === "defense" && <span className="text-[9px] uppercase tracking-widest bg-emerald-500 text-black px-1.5 py-0.5 font-medium">Active</span>}
            </div>
            <h4 className="font-serif text-lg text-white font-light mb-1">Capital Preservation</h4>
            <p className="text-[11px] font-light text-[#A0A0A0] leading-relaxed">
              Freezes discretionary SaaS seats, halts non-essential hiring, and caps burn. Extends forward runway to maximum ceiling.
            </p>
          </button>

          <button
            onClick={() => setProtocol("baseline")}
            className={`p-5 text-left border transition-all cursor-pointer ${
              protocol === "baseline"
                ? "border-white bg-[#121212] text-white"
                : "border-[#222222] bg-black text-[#707070] hover:border-[#404040]"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-white">STANDARD</span>
              {protocol === "baseline" && <span className="text-[9px] uppercase tracking-widest bg-white text-black px-1.5 py-0.5 font-medium">Active</span>}
            </div>
            <h4 className="font-serif text-lg text-white font-light mb-1">Baseline Operations</h4>
            <p className="text-[11px] font-light text-[#A0A0A0] leading-relaxed">
              Standard operating cadence adhering to current contracted revenue velocity and organic operational expenses.
            </p>
          </button>

          <button
            onClick={() => setProtocol("aggressive")}
            className={`p-5 text-left border transition-all cursor-pointer ${
              protocol === "aggressive"
                ? "border-red-500 bg-[#1F0E0E] text-white"
                : "border-[#222222] bg-black text-[#707070] hover:border-[#404040]"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-[10px] uppercase tracking-widest font-mono text-red-400">EXPANSION</span>
              {protocol === "aggressive" && <span className="text-[9px] uppercase tracking-widest bg-red-500 text-white px-1.5 py-0.5 font-medium">Active</span>}
            </div>
            <h4 className="font-serif text-lg text-white font-light mb-1">Aggressive Territory Capture</h4>
            <p className="text-[11px] font-light text-[#A0A0A0] leading-relaxed">
              Accelerates marketing CAC and engineering headcount by +15%. Models high-velocity growth against accelerated cash burn.
            </p>
          </button>
        </div>
      </div>

      {/* Projection Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-[#222222] pb-10">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Ending Liquid Reserves</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{formatCur(endingCash)}</div>
          <span className={`text-xs mt-1 block ${netDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {netDelta >= 0 ? "+" : ""}{formatCur(netDelta)} net reserve delta
          </span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Modeled Runway</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            {(endingCash / (baseMonthlyExp * 1.1)).toFixed(1)} Mo
          </div>
          <span className="text-xs text-[#707070] mt-1 block">Forward coverage safety</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Modeled MoM Growth</span>
          <div className="font-serif text-3xl sm:text-4xl text-emerald-400 font-light">
            +{effectiveGrowth}%
          </div>
          <span className="text-xs text-[#707070] mt-1 block">Applied trajectory rate</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Outflow Escalation</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            +{effectiveExpense}%
          </div>
          <span className="text-xs text-[#707070] mt-1 block">Expense inflation index</span>
        </div>
      </div>

      {/* 2. Primary Forward Trajectory Chart */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
        <div className="pb-6 mb-6 border-b border-[#222222] flex justify-between items-center">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Trajectory</span>
            <h3 className="font-serif text-2xl text-white font-light mt-1">Forward Reserve Liquidity vs Velocity</h3>
          </div>
          <span className="text-[10px] uppercase tracking-widest text-[#707070] border border-[#222222] px-3 py-1">
            Active: {protocol.toUpperCase()}
          </span>
        </div>
        {mounted && (
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={projectionData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid stroke="#1c1c1c" vertical={false} strokeDasharray="2 2" />
                <XAxis dataKey="period" stroke="#525252" tickLine={false} style={{ fontSize: "11px" }} />
                <YAxis stroke="#525252" tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} style={{ fontSize: "11px" }} />
                <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#333", fontSize: "12px", color: "#fff" }} />
                <Line type="monotone" dataKey="projectedCash" name="Reserve Liquidity" stroke="#FFFFFF" strokeWidth={2} dot={{ fill: "#FFFFFF", r: 3 }} />
                <Line type="monotone" dataKey="projectedRevenue" name="Monthly Inflow" stroke="#4E8752" strokeWidth={1.5} strokeDasharray="4 4" />
                <Line type="monotone" dataKey="projectedExpenses" name="Monthly Outflow" stroke="#A84E4E" strokeWidth={1.5} strokeDasharray="4 4" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* 3. The 2D Runway Sensitivity Matrix (Quantitative Stress-Test Heatmap) */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
        <div className="pb-6 mb-6 border-b border-[#222222] flex justify-between items-center">
          <div>
            <div className="flex items-center space-x-2">
              <Grid size={15} className="text-white" />
              <h3 className="font-serif text-2xl text-white font-light">2D Runway Sensitivity Matrix</h3>
            </div>
            <p className="text-xs text-[#707070] mt-1 font-light">
              Stress-test forward runway months across 25 simultaneous macroeconomic permutations.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs font-mono">
            <thead>
              <tr className="border-b border-[#222222] text-[10px] uppercase text-[#707070]">
                <th className="p-3 text-left font-sans">Growth \ Inflation</th>
                {expInflationScenarios.map((e) => (
                  <th key={e} className="p-3 font-normal">+{e}% Exp Inflation</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]">
              {revGrowthScenarios.map((g) => (
                <tr key={g} className="hover:bg-[#121212]">
                  <td className="p-3 text-left font-sans text-xs text-white">
                    <span className={g < 0 ? "text-red-400" : "text-emerald-400"}>
                      {g >= 0 ? "+" : ""}{g}%
                    </span>{" "}
                    Revenue Growth
                  </td>
                  {expInflationScenarios.map((e) => {
                    const runwayMonths = calculateRunwayCell(g, e);
                    const isSevere = parseFloat(runwayMonths) < 12;
                    const isHealthy = parseFloat(runwayMonths) >= 24 || runwayMonths === ">48";
                    return (
                      <td key={e} className="p-3">
                        <span
                          className={`px-3 py-1 text-xs border ${
                            isSevere
                              ? "bg-red-950/40 border-red-900 text-red-300 font-bold"
                              : isHealthy
                              ? "bg-[#0F1E12] border-emerald-900 text-emerald-400 font-medium"
                              : "bg-black border-[#222] text-white"
                          }`}
                        >
                          {runwayMonths} Mo
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="pt-4 border-t border-[#1c1c1c] text-[10px] text-[#707070] flex justify-between">
          <span>Emerald: &gt; 24 Mo Safe Runway</span>
          <span>Red: &lt; 12 Mo Critical Capital Draw</span>
        </div>
      </div>
    </div>
  );
}
