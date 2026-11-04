import React from "react";
import { Sparkles, TrendingUp, AlertCircle } from "lucide-react";

export const FinancialInsights: React.FC = () => {
  const insights = [
    {
      title: "Margin Expansion Detected",
      desc: "Operating margin expanded +4.2 percentage points over the last 90 days following infrastructure rightsizing.",
      icon: TrendingUp,
    },
    {
      title: "Runway Sustainability",
      desc: "At the current net burn velocity of $22,800/mo, verified liquid cash reserves guarantee 20.6 months of operations.",
      icon: Sparkles,
    },
    {
      title: "Vendor Variance Notice",
      desc: "Software licensing increased by 8.4% in October. Review seat allocation prior to calendar year end renewals.",
      icon: AlertCircle,
    },
  ];

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
      <div className="flex items-center space-x-2 pb-6 mb-6 border-b border-[#222222]">
        <Sparkles size={14} className="text-[#A0A0A0]" />
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#A0A0A0]">
          Automated Financial Intelligence
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((item, idx) => (
          <div key={idx} className="border-l border-[#222222] pl-4 py-1">
            <h4 className="text-xs font-sans tracking-wide text-white uppercase font-medium mb-1">
              {item.title}
            </h4>
            <p className="text-xs font-sans text-[#A0A0A0] font-light leading-relaxed">
              {item.desc}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
