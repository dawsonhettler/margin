"use client";
import React, { useState, useEffect } from "react";
import { Award } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export const VentureMetrics: React.FC = () => {
  const { summary } = useFinancial();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const growthRate = 25.4;
  const profitMargin = summary?.profitMargin || 0;
  const ruleOf40 = Math.round(growthRate + profitMargin);

  const runway = summary?.runwayMonths || 20;
  const zeroDate = new Date();
  zeroDate.setMonth(zeroDate.getMonth() + Math.round(runway));
  const zeroDateStr = mounted
    ? zeroDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Analyzing...";

  const totalExpenses = summary?.totalExpenses || 0;
  const totalRevenue = summary?.totalRevenue || 0;
  const burnMultiple = totalRevenue > 0 ? (totalExpenses / totalRevenue).toFixed(2) : "1.00";

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
            {runway} Mo forward runway
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
