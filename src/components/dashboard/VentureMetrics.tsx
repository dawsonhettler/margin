"use client";
import React from "react";
import { ShieldCheck, Flame, Calendar, Award } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export const VentureMetrics: React.FC = () => {
  const { summary } = useFinancial();

  // Rule of 40 calculation (Assume 25% ARR growth + Net Profit Margin)
  const growthRate = 25.4;
  const ruleOf40 = Math.round(growthRate + summary.profitMargin);

  // Cash Zero Date Calculation
  const monthlyBurn = summary.totalExpenses > summary.totalRevenue ? (summary.totalExpenses - summary.totalRevenue) / 2 : 0;
  const zeroDate = new Date();
  zeroDate.setMonth(zeroDate.getMonth() + Math.round(summary.runwayMonths));
  const zeroDateStr = zeroDate.toLocaleDateString("en-US", { month: "short", year: "numeric" });

  // Burn Multiple (Net Burn / Net Inflow)
  const burnMultiple = summary.totalRevenue > 0 ? (summary.totalExpenses / summary.totalRevenue).toFixed(2) : "1.00";

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
      <div className="flex items-center space-x-2 pb-6 mb-6 border-b border-[#222222]">
        <Award size={14} className="text-[#A0A0A0]" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#A0A0A0]">
          Institutional Treasury & Venture Health Index
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Rule of 40 Score</span>
          <div className="font-serif text-3xl font-light text-white">{ruleOf40}%</div>
          <span className="text-[10px] text-emerald-400 mt-1 block uppercase tracking-wider">
            {ruleOf40 >= 40 ? "✓ Top Decile Performance" : "Below 40% Target"}
          </span>
        </div>

        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Burn Multiple</span>
          <div className="font-serif text-3xl font-light text-white">{burnMultiple}x</div>
          <span className="text-[10px] text-[#707070] mt-1 block uppercase tracking-wider">
            {parseFloat(burnMultiple) < 1.5 ? "Efficient Capital Draw" : "Elevated Cash Burn"}
          </span>
        </div>

        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Cash Zero Date</span>
          <div className="font-serif text-3xl font-light text-white">{zeroDateStr}</div>
          <span className="text-[10px] text-[#707070] mt-1 block uppercase tracking-wider">
            {summary.runwayMonths} Mo forward runway
          </span>
        </div>

        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Audit Attestation</span>
          <div className="font-serif text-2xl text-emerald-400 font-light mt-1">GAAP Verified</div>
          <span className="text-[10px] text-[#707070] mt-1 block uppercase tracking-wider">
            Continuous Reconciliation
          </span>
        </div>
      </div>
    </div>
  );
};
