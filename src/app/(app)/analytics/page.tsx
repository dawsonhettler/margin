"use client";
import React, { useState, useEffect, useMemo } from "react";
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
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";

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

  // Dynamically group live transactions by month
  const liveChartData = useMemo(() => {
    if (transactions.length === 0) {
      return [
        { month: "Jan", revenue: 0, expenses: 0, profit: 0 },
        { month: "Feb", revenue: 0, expenses: 0, profit: 0 },
        { month: "Mar", revenue: 0, expenses: 0, profit: 0 },
        { month: "Apr", revenue: 0, expenses: 0, profit: 0 },
        { month: "May", revenue: 0, expenses: 0, profit: 0 },
        { month: "Jun", revenue: 0, expenses: 0, profit: 0 },
      ];
    }

    const monthMap: Record<string, { revenue: number; expenses: number }> = {};
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    
    // Initialize past 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const name = monthNames[d.getMonth()];
      monthMap[name] = { revenue: 0, expenses: 0 };
    }

    transactions.forEach((t) => {
      const tDate = new Date(t.date);
      const name = monthNames[tDate.getMonth()];
      if (monthMap[name]) {
        if (t.type === "income") monthMap[name].revenue += t.amount;
        if (t.type === "expense") monthMap[name].expenses += t.amount;
      }
    });

    return Object.entries(monthMap).map(([month, vals]) => ({
      month,
      revenue: vals.revenue,
      expenses: vals.expenses,
      profit: vals.revenue - vals.expenses,
    }));
  }, [transactions]);

  const getFilteredChartData = () => {
    if (timeframe === "90D") return liveChartData.slice(-3);
    return liveChartData;
  };

  return (
    <MotionWrapper className="space-y-10 pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block font-sans">
            Performance Ledger • Quantitative Analysis
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Financial Analytics
          </h1>
        </div>

        {/* Timeframe Filter Buttons */}
        <div className="flex border border-white/10 bg-black/60 p-1 backdrop-blur-md">
          {(["90D", "180D", "ALL"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
                timeframe === t ? "bg-white text-black font-medium" : "text-neutral-400 hover:text-white"
              }`}
            >
              {t === "90D" ? "Trailing 90D" : t === "180D" ? "Trailing 6M" : "Full Horizon"}
            </button>
          ))}
        </div>
      </div>

      {/* Primary Analytics Metric Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-white/[0.08] pb-10">
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Operating Spread</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{grossMargin}%</div>
          <span className="text-xs text-emerald-400 mt-1 block">Net capital retention</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Contract Velocity</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{incomeTx.length} Deals</div>
          <span className="text-xs text-neutral-400 mt-1 block">Active closed revenue streams</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Avg Deal Capital</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{formatCur(avgTxValue)}</div>
          <span className="text-xs text-neutral-400 mt-1 block">Per recorded inflow receipt</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Projected Annualized</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{formatCur(summary.totalRevenue * 2)}</div>
          <span className="text-xs text-emerald-400 mt-1 block">Based on trailing run rate</span>
        </GlassCard>
      </div>

      {transactions.length === 0 ? (
        <GlassCard className="p-16 text-center space-y-4">
          <h3 className="font-serif text-2xl text-white font-light">No Analytics Data Available</h3>
          <p className="text-xs text-neutral-400 max-w-sm mx-auto font-light">
            Record transactions or import a bank statement to generate live historical regression curves and capital retention charts.
          </p>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <GlassCard className="p-6 sm:p-8">
              <div className="pb-6 mb-6 border-b border-white/[0.08] flex justify-between items-center">
                <div>
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500">Historical Regression</span>
                  <h3 className="font-serif text-2xl text-white font-light mt-1">Revenue Inflow vs Operating Burn</h3>
                </div>
              </div>
              {mounted && (
                <div className="h-72 w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={getFilteredChartData()} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                      <CartesianGrid stroke="#222" vertical={false} strokeDasharray="2 2" />
                      <XAxis dataKey="month" stroke="#525252" tickLine={false} style={{ fontSize: "11px" }} />
                      <YAxis stroke="#525252" tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} style={{ fontSize: "11px" }} />
                      <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#333", fontSize: "12px", color: "#fff" }} />
                      <Area type="monotone" dataKey="revenue" stroke="#FFFFFF" fill="#FFFFFF" fillOpacity={0.15} strokeWidth={1.5} />
                      <Area type="monotone" dataKey="expenses" stroke="#707070" fill="#707070" fillOpacity={0.1} strokeWidth={1.5} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              )}
            </GlassCard>
          </div>

          <div className="lg:col-span-4">
            <GlassCard className="p-6 sm:p-8 flex flex-col justify-between h-full">
              <div>
                <div className="pb-6 mb-6 border-b border-white/[0.08]">
                  <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500">Net Margin Spread</span>
                  <h3 className="font-serif text-2xl text-white font-light mt-1">Monthly Capital Retention</h3>
                </div>
                {mounted && (
                  <div className="h-56 w-full">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={getFilteredChartData()}>
                        <CartesianGrid stroke="#222" vertical={false} />
                        <XAxis dataKey="month" stroke="#525252" tickLine={false} style={{ fontSize: "10px" }} />
                        <YAxis stroke="#525252" tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} style={{ fontSize: "10px" }} />
                        <Tooltip contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#333", fontSize: "11px" }} />
                        <Bar dataKey="profit" fill="#FFFFFF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </div>
              <div className="text-[11px] text-neutral-400 pt-4 border-t border-white/[0.08] font-light">
                Net capital retention derived from verified Supabase general ledger entries.
              </div>
            </GlassCard>
          </div>
        </div>
      )}
    </MotionWrapper>
  );
}
