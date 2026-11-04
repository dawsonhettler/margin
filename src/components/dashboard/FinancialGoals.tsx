"use client";
import React from "react";
import { Target, ArrowUpRight } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export const FinancialGoals: React.FC = () => {
  const { summary } = useFinancial();

  const goals = [
    {
      name: "Liquid Capital Reserve Target",
      current: summary.cashPosition,
      target: 1000000,
      format: (v: number) => `$${(v / 1000).toFixed(0)}k`,
    },
    {
      name: "Operating Spread (Margin Target)",
      current: summary.profitMargin,
      target: 45.0,
      format: (v: number) => `${v}%`,
    },
    {
      name: "Runway Safety Buffer",
      current: summary.runwayMonths,
      target: 24.0,
      format: (v: number) => `${v} Mo`,
    },
  ];

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
      <div className="flex items-center space-x-2 pb-6 mb-6 border-b border-[#222222]">
        <Target size={14} className="text-[#A0A0A0]" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#A0A0A0]">
          Executive Milestones & Capital Goals
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {goals.map((g) => {
          const pct = Math.min(100, Math.round((g.current / g.target) * 100));
          return (
            <div key={g.name} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#A0A0A0] font-light text-[11px]">{g.name}</span>
                <span className="text-white font-mono font-medium">
                  {g.format(g.current)} / {g.format(g.target)}
                </span>
              </div>
              <div className="w-full bg-[#1c1c1c] h-1">
                <div
                  className="bg-white h-1 transition-all duration-500"
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className="text-[10px] text-[#707070] block tracking-wider uppercase">
                {pct}% of quarterly milestone achieved
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
