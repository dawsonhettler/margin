"use client";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { useFinancial } from "@/context/FinancialContext";
import { MONTHLY_PERFORMANCE } from "@/lib/sample-data";

export default function AnalyticsPage() {
  const { summary, transactions } = useFinancial();
  const [timeframe, setTimeframe] = useState<"90D" | "180D" | "ALL">("180D");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const incomeTx = transactions.filter((t) => t.type === "income");
  const avgTxValue = incomeTx.length > 0 ? Math.round(summary.totalRevenue / incomeTx.length) : 0;
  const grossMargin = summary.totalRevenue > 0 ? ((summary.netProfit / summary.totalRevenue) * 100).toFixed(1) : "0.0";

  const getFilteredChartData = () => {
    if (timeframe === "90D") return MONTHLY_PERFORMANCE.slice(-3);
    return MONTHLY_PERFORMANCE;
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Performance Ledger • Quantitative Analysis
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Financial Analytics
          </h1>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex border border-[#222222] bg-[#0A0A0A] p-1">
          {(["90D", "180D", "ALL"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                timeframe === t ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
              }`}
            >
              {t === "90D" ? "Trailing 90D" : t === "180D" ? "Trailing 6M" : "Full Horizon"}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Analytics Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-[#222222] pb-10">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Operating Spread</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{grossMargin}%</div>
          <span className="text-xs text-emerald-500 mt-1 block">+3.8% efficiency delta</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Contract Velocity</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{incomeTx.length} Deals</div>
          <span className="text-xs text-[#707070] mt-1 block">Active closed revenue streams</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Avg Deal Capital</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{formatCur(avgTxValue)}</div>
          <span className="text-xs text-[#707070] mt-1 block">Per recorded inflow receipt</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Projected Annualized</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{formatCur(summary.totalRevenue * 2)}</div>
          <span className="text-xs text-emerald-500 mt-1 block">Based on trailing run rate</span>
        </div>
      </div>

      {/* Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
          <div className="pb-6 mb-6 border-b border-[#222222] flex justify-between items-center">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Historical Regression</span>
              <h3 className="font-serif text-2xl text-white font-light mt-1">Revenue Inflow vs Operating Burn</h3>
            </div>
          </div>
          {mounted && (
            <div className="h-72 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={getFilteredChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid stroke="#1c1c1c" vertical={false} strokeDasharray="2 2" />
                  <XAxis dataKey="month" stroke="#525252" tickLine={false} style={{ fontSize: "11px" }} />
                  <YAxis stroke="#525252" tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} style={{ fontSize: "11px" }} />
                  <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#333", fontSize: "12px", color: "#fff" }} />
                  <Area type="monotone" dataKey="revenue" stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.15} strokeWidth={1.5} />
                  <Area type="monotone" dataKey="expenses" stroke="#707070" fill="#707070" fillOpacity={0.1} strokeWidth={1.5} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div className="lg:col-span-4 border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between">
          <div>
            <div className="pb-6 mb-6 border-b border-[#222222]">
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Net Margin Spread</span>
              <h3 className="font-serif text-2xl text-white font-light mt-1">Monthly Capital Retention</h3>
            </div>
            {mounted && (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={getFilteredChartData()}>
                    <CartesianGrid stroke="#1c1c1c" vertical={false} />
                    <XAxis dataKey="month" stroke="#525252" tickLine={false} style={{ fontSize: "10px" }} />
                    <YAxis stroke="#525252" tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} style={{ fontSize: "10px" }} />
                    <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#333", fontSize: "11px" }} />
                    <Bar dataKey="profit" fill="#FFFFFF" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </div>
          <div className="text-[11px] text-[#707070] pt-4 border-t border-[#222222]">
            Capital retention currently exceeds the 30% baseline for venture-backed SaaS entities.
          </div>
        </div>
      </div>
    </div>
  );
}
