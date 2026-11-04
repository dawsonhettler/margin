"use client";
import React from "react";
import { ArrowUpRight, TrendingDown } from "lucide-react";
import { FinancialSummary } from "@/lib/sample-data";
import { GlassCard } from "@/components/ui/GlassCard";

interface Props {
  summary: FinancialSummary;
}

export const FinancialKpis: React.FC<Props> = ({ summary }) => {
  const formatCur = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 sm:gap-6">
      {/* KPI 1 */}
      <GlassCard className="p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
            Total Revenue
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
            {formatCur(summary.totalRevenue)}
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs font-sans text-emerald-400">
          <ArrowUpRight size={13} className="mr-0.5" />
          <span className="tracking-wide">+21.4% YoY</span>
        </div>
      </GlassCard>

      {/* KPI 2 */}
      <GlassCard className="p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
            Total Expenses
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
            {formatCur(summary.totalExpenses)}
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs font-sans text-[#808080]">
          <span className="tracking-wide">+4.8% vs plan</span>
        </div>
      </GlassCard>

      {/* KPI 3 */}
      <GlassCard className="p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
            Net Profit
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
            {formatCur(summary.netProfit)}
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs font-sans text-emerald-400">
          <ArrowUpRight size={13} className="mr-0.5" />
          <span className="tracking-wide">+34.1% YoY</span>
        </div>
      </GlassCard>

      {/* KPI 4 */}
      <GlassCard className="p-5 sm:p-6 flex flex-col justify-between">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
            Profit Margin
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
            {summary.profitMargin}%
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs font-sans text-emerald-400">
          <span className="tracking-wide">Healthy (&gt;35% baseline)</span>
        </div>
      </GlassCard>

      {/* KPI 5 */}
      <GlassCard className="p-5 sm:p-6 flex flex-col justify-between col-span-2 lg:col-span-1">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
            Cash Position
          </span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
            {formatCur(summary.cashPosition)}
          </div>
        </div>
        <div className="mt-3 flex items-center text-xs font-sans text-[#808080]">
          <span className="tracking-wide">{summary.runwayMonths} Mo Runway</span>
        </div>
      </GlassCard>
    </div>
  );
};
