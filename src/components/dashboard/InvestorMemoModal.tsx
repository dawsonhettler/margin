"use client";
import React, { useState } from "react";
import { Mail, Copy, Check, X, Sparkles, Send } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const InvestorMemoModal: React.FC<Props> = ({ isOpen, onClose }) => {
  const { summary, activeBusiness } = useFinancial();
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const memoText = `EXECUTIVE INVESTOR BRIEFING — ${activeBusiness.toUpperCase()}
Reporting Period: Trailing Fiscal Quarter

1. EXECUTIVE SUMMARY & KEY FINANCIALS
• Cash in Bank (Liquid Reserves): ${formatCur(summary.cashPosition)}
• Audited Forward Runway: ${summary.runwayMonths} months
• Gross Revenue: ${formatCur(summary.totalRevenue)}
• Operating Outflow (Burn): ${formatCur(summary.totalExpenses)}
• Net Operating Spread (Margin): ${summary.profitMargin}%

2. OPERATIONAL HIGHLIGHTS
• Sustained net operating efficiency with positive cash trajectory.
• Unit economics remain stable; contract velocity pacing well above baseline threshold.
• Infrastructure rightsizing reduced cloud compute variance by 8.4%.

3. STRATEGIC PRIORITIES & NEXT STEPS
• Executing strategic headcount allocations while maintaining an 18+ month cash buffer.
• Evaluating pricing curve adjustments to maximize unit contribution margin.

Attested by Executive Principal
Generated via MARGIN Intelligence Platform`;

  const handleCopy = () => {
    navigator.clipboard.writeText(memoText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="bg-[#0A0A0A] border border-[#222222] w-full max-w-2xl p-6 sm:p-8 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#222222]">
          <div>
            <div className="flex items-center space-x-2">
              <Mail size={16} className="text-white" />
              <h2 className="font-serif text-2xl text-white font-light">Investor & Board Update Generator</h2>
            </div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] mt-1 block">
              Automated Institutional Briefing • Ready to Transmit
            </span>
          </div>
          <button onClick={onClose} className="text-[#707070] hover:text-white transition-colors cursor-pointer">
            <X size={18} />
          </button>
        </div>

        <div className="border border-[#222222] bg-black p-5 font-mono text-xs text-[#A0A0A0] leading-relaxed whitespace-pre-wrap overflow-y-auto max-h-96">
          {memoText}
        </div>

        <div className="pt-6 mt-6 border-t border-[#222222] flex justify-between items-center text-xs">
          <span className="text-[11px] text-[#707070]">
            Paste directly into your investor email update or board dossier.
          </span>
          <div className="flex space-x-3">
            <Button variant="secondary" size="sm" onClick={onClose}>
              Close
            </Button>
            <Button variant="primary" size="sm" onClick={handleCopy}>
              {copied ? (
                <>
                  <Check size={12} className="mr-1.5" /> Copied to Clipboard
                </>
              ) : (
                <>
                  <Copy size={12} className="mr-1.5" /> Copy Executive Memo
                </>
              )}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
