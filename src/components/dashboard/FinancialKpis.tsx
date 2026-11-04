import React from "react";
import { ArrowUpRight } from "lucide-react";
import { FinancialSummary } from "@/lib/sample-data";

interface Props {
  summary: FinancialSummary;
}

export const FinancialKpis: React.FC<Props> = ({ summary }) => {
  const formatCur = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(val);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 sm:gap-8 border-b border-[#222222] pb-10">
      <div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
          Total Revenue
        </span>
        <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
          {formatCur(summary.totalRevenue)}
        </div>
        <div className="mt-2 flex items-center text-xs font-sans text-emerald-500">
          <ArrowUpRight size={13} className="mr-0.5" />
          <span>+21.4% YoY</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
          Total Expenses
        </span>
        <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
          {formatCur(summary.totalExpenses)}
        </div>
        <div className="mt-2 flex items-center text-xs font-sans text-[#707070]">
          <span>+4.8% vs plan</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
          Net Profit
        </span>
        <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
          {formatCur(summary.netProfit)}
        </div>
        <div className="mt-2 flex items-center text-xs font-sans text-emerald-500">
          <ArrowUpRight size={13} className="mr-0.5" />
          <span>+34.1% YoY</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
          Profit Margin
        </span>
        <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
          {summary.profitMargin}%
        </div>
        <div className="mt-2 flex items-center text-xs font-sans text-emerald-500">
          <span>Healthy (&gt;35% baseline)</span>
        </div>
      </div>

      <div>
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
          Cash Position
        </span>
        <div className="font-serif text-3xl sm:text-4xl text-white font-light tracking-tight">
          {formatCur(summary.cashPosition)}
        </div>
        <div className="mt-2 flex items-center text-xs font-sans text-[#707070]">
          <span>{summary.runwayMonths} Mo Runway</span>
        </div>
      </div>
    </div>
  );
};
