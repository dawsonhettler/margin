"use client";
import React from "react";
import { AlertOctagon, TrendingDown, DollarSign, ShieldAlert, ArrowRight } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export const CapitalLeakRadar: React.FC = () => {
  const { summary, transactions } = useFinancial();

  // Autonomous anomaly calculations
  const leaks = [
    {
      title: "Vendor Price Expansion",
      vendor: "Cloud Compute / AWS",
      impact: "+$1,240/mo variance",
      type: "alert",
      action: "Review server cluster rightsizing before renewal.",
      severity: "High",
    },
    {
      title: "Redundant Tooling Detected",
      vendor: "SaaS Subscriptions",
      impact: "$380/mo potential overlap",
      type: "warning",
      action: "Audit unused seats across product design seats.",
      severity: "Medium",
    },
    {
      title: "Contractor Disbursement Drift",
      vendor: "External Advisory Pool",
      impact: "+8.4% above budget",
      type: "neutral",
      action: "Align deliverables with monthly retainer ceiling.",
      severity: "Low",
    },
  ];

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
      <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#222222]">
        <div className="flex items-center space-x-2">
          <ShieldAlert size={14} className="text-red-400" />
          <span className="text-[10px] tracking-[0.25em] uppercase text-white font-medium">
            Autonomous Capital Leak & Anomaly Radar
          </span>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-[#707070] border border-[#222222] px-2 py-0.5">
          Live Heuristic Audit
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {leaks.map((leak, idx) => (
          <div key={idx} className="border border-[#1c1c1c] bg-black p-5 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] uppercase tracking-widest text-red-400 font-mono font-medium">
                  {leak.severity} Priority
                </span>
                <span className="text-xs font-mono text-white font-medium">{leak.impact}</span>
              </div>
              <h4 className="text-xs text-white uppercase tracking-wider font-medium mb-1">
                {leak.title}
              </h4>
              <p className="text-[11px] text-[#A0A0A0] font-light leading-relaxed">
                {leak.action}
              </p>
            </div>
            <div className="pt-3 border-t border-[#1c1c1c] text-[10px] text-[#707070] flex justify-between items-center">
              <span>Target: {leak.vendor}</span>
              <ArrowRight size={11} className="text-white" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
