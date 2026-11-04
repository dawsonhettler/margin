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
import { AlertTriangle, TrendingUp, Sliders } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export default function ForecastingPage() {
  const { summary } = useFinancial();
  const [mounted, setMounted] = useState(false);
  const [growthRate, setGrowthRate] = useState(12); // +12% MoM
  const [expenseEscalation, setExpenseEscalation] = useState(4); // +4% MoM
  const [horizonMonths, setHorizonMonths] = useState(6);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  // Generate deterministic forward model
  const baseMonthlyRev = summary.totalRevenue > 0 ? summary.totalRevenue / 3 : 25000;
  const baseMonthlyExp = summary.totalExpenses > 0 ? summary.totalExpenses / 3 : 15000;

  const projectionData = [];
  let currentCash = summary.cashPosition;
  const monthNames = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6", "Month 9", "Month 12"];

  for (let i = 1; i <= horizonMonths; i++) {
    const rev = baseMonthlyRev * Math.pow(1 + growthRate / 100, i);
    const exp = baseMonthlyExp * Math.pow(1 + expenseEscalation / 100, i);
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

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Forward Projections • Deterministic Model
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Cash Flow Forecasting
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

      {/* Control Sliders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-widest text-white flex items-center">
              <TrendingUp size={13} className="mr-2 text-emerald-400" /> Projected Revenue Growth (MoM)
            </span>
            <span className="font-mono text-sm text-white font-medium">+{growthRate}%</span>
          </div>
          <input
            type="range"
            min="-10"
            max="40"
            value={growthRate}
            onChange={(e) => setGrowthRate(parseInt(e.target.value))}
            className="w-full accent-white cursor-pointer bg-[#222222] h-1"
          />
          <span className="text-[10px] text-[#707070] mt-2 block">
            Baseline contracted customer velocity model
          </span>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs uppercase tracking-widest text-white flex items-center">
              <Sliders size={13} className="mr-2 text-[#A0A0A0]" /> Projected Expense Escalation (MoM)
            </span>
            <span className="font-mono text-sm text-white font-medium">+{expenseEscalation}%</span>
          </div>
          <input
            type="range"
            min="-5"
            max="25"
            value={expenseEscalation}
            onChange={(e) => setExpenseEscalation(parseInt(e.target.value))}
            className="w-full accent-white cursor-pointer bg-[#222222] h-1"
          />
          <span className="text-[10px] text-[#707070] mt-2 block">
            Anticipated infrastructure & operational inflation
          </span>
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
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Horizon Runway</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            {(endingCash / (baseMonthlyExp * 1.1)).toFixed(1)} Mo
          </div>
          <span className="text-xs text-[#707070] mt-1 block">Extrapolated forward coverage</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Terminal Mo Inflow</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            {formatCur(projectionData[projectionData.length - 1]?.projectedRevenue || 0)}
          </div>
          <span className="text-xs text-emerald-400 mt-1 block">Exit monthly velocity</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Cash Flow Status</span>
          <div className="font-serif text-2xl text-emerald-400 font-light mt-1">Accretive Growth</div>
          <span className="text-xs text-[#707070] mt-1 block">Positive net reinvestment</span>
        </div>
      </div>

      {/* Chart */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
        <div className="pb-6 mb-6 border-b border-[#222222]">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Trajectory</span>
          <h3 className="font-serif text-2xl text-white font-light mt-1">Forward Capital Reserves Curve</h3>
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

      {/* Governance Disclaimer */}
      <div className="border border-[#222222] p-6 bg-black flex items-start space-x-4">
        <AlertTriangle size={16} className="text-[#707070] shrink-0 mt-0.5" />
        <div className="text-xs text-[#A0A0A0] font-light leading-relaxed">
          <strong className="text-white font-medium block uppercase text-[10px] tracking-widest mb-1">
            Forecasting Model Governance
          </strong>
          Projections reflect deterministic extrapolation based on historical velocity and user-specified growth curves. Actual cash performance may vary based on market churn elasticity, accounts receivable lags, and unbudgeted capital commitments.
        </div>
      </div>
    </div>
  );
}
