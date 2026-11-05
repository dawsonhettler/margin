"use client";
import React, { useState } from "react";
import Link from "next/link";
import { UploadCloud, Plus, FileDown, Mail, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { GlassCard } from "@/components/ui/GlassCard";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { FinancialInsights } from "@/components/dashboard/FinancialInsights";
import { FinancialGoals } from "@/components/dashboard/FinancialGoals";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ImportCsvModal } from "@/components/dashboard/ImportCsvModal";
import { InvestorMemoModal } from "@/components/dashboard/InvestorMemoModal";
import { useFinancial } from "@/context/FinancialContext";

export default function OverviewPage() {
  const { summary, setIsRecordModalOpen } = useFinancial();
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);
  const [isMemoOpen, setIsMemoOpen] = useState(false);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  // Today's formatted date (Old Money publication style)
  const todayFormatted = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date());

  return (
    <MotionWrapper className="space-y-16 pb-24 max-w-6xl mx-auto px-4 sm:px-6">
      {/* Publication Masthead Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-white/[0.08]">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <span className="font-serif tracking-[0.35em] text-sm uppercase text-neutral-400 font-light">
              M A R G I N
            </span>
            <span className="text-neutral-700">•</span>
            <span className="text-[11px] tracking-[0.2em] uppercase text-neutral-500 font-sans">
              {todayFormatted}
            </span>
          </div>
          <h1 className="font-serif text-4xl sm:text-6xl font-light text-neutral-100 tracking-tight">
            Your business at a glance.
          </h1>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="glass" size="sm" onClick={() => setIsMemoOpen(true)}>
            <Mail size={13} className="mr-1.5" /> Investor Memo
          </Button>
          <Button variant="glass" size="sm" onClick={() => setIsCsvModalOpen(true)}>
            <UploadCloud size={13} className="mr-1.5" /> Import Statement
          </Button>
          <Link href="/reports">
            <Button variant="glass" size="sm">
              <FileDown size={13} className="mr-1.5" /> Dossier
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsRecordModalOpen(true)}>
            <Plus size={13} className="mr-1" /> Record Entry
          </Button>
        </div>
      </div>

      {/* Large Editorial Net Profit Hero Figure */}
      <div className="py-6 space-y-3">
        <span className="text-[10px] tracking-[0.3em] uppercase text-neutral-500 block font-sans">
          Fiscal Performance • Net Profit This Month
        </span>
        <div className="font-serif text-6xl sm:text-8xl font-light text-white tracking-tighter">
          {formatCur(summary.netProfit)}
        </div>
        <div className="flex items-center text-xs font-sans text-emerald-400 space-x-2 pt-1">
          <ArrowUpRight size={14} />
          <span className="tracking-widest uppercase font-medium">+12.8% compared to last month</span>
        </div>
      </div>

      {/* Elegant Financial Chart Spanning Most of the Screen */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-white/[0.06] pb-3">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-400 font-sans">
            Macro Trajectory & Capital Flows
          </span>
          <span className="text-[10px] tracking-widest uppercase text-neutral-600 font-mono">
            Trailing 6 Months
          </span>
        </div>
        <RevenueChart />
      </div>

      {/* Three Carefully Aligned Financial Sections: Revenue, Expenses, Cash Position */}
      <div className="space-y-6 pt-4">
        <div className="border-b border-white/[0.08] pb-4">
          <h3 className="font-serif text-2xl font-light text-neutral-200">
            Core Treasury Metrics
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Revenue Section */}
          <GlassCard className="p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-2">
                Section I • Gross Inflow
              </span>
              <div className="font-serif text-4xl text-white font-light tracking-tight">
                {formatCur(summary.totalRevenue)}
              </div>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-xs text-neutral-400 font-light flex justify-between">
              <span>Verified Inflows</span>
              <span className="text-emerald-400 font-mono">+21.4% YoY</span>
            </div>
          </GlassCard>

          {/* Expenses Section */}
          <GlassCard className="p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-2">
                Section II • Total Disbursements
              </span>
              <div className="font-serif text-4xl text-white font-light tracking-tight">
                {formatCur(summary.totalExpenses)}
              </div>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-xs text-neutral-400 font-light flex justify-between">
              <span>OpEx Pool</span>
              <span className="text-neutral-300 font-mono">+4.8% vs plan</span>
            </div>
          </GlassCard>

          {/* Cash Position Section */}
          <GlassCard className="p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-2">
                Section III • Reserve Liquidity
              </span>
              <div className="font-serif text-4xl text-white font-light tracking-tight">
                {formatCur(summary.cashPosition)}
              </div>
            </div>
            <div className="pt-4 border-t border-white/[0.06] text-xs text-neutral-400 font-light flex justify-between">
              <span>Forward Coverage</span>
              <span className="text-white font-mono">{summary.runwayMonths} Mo Runway</span>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Secondary Spaced Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 pt-6">
        <div className="lg:col-span-7">
          <ExpenseBreakdown />
        </div>
        <div className="lg:col-span-5 space-y-8">
          <FinancialGoals />
          <FinancialInsights />
        </div>
      </div>

      {/* General Ledger Table */}
      <div className="pt-8">
        <RecentTransactions />
      </div>

      {/* Modals */}
      <ImportCsvModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} />
      <InvestorMemoModal isOpen={isMemoOpen} onClose={() => setIsMemoOpen(false)} />
    </MotionWrapper>
  );
}
