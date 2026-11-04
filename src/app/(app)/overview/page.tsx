"use client";
import React, { useState } from "react";
import Link from "next/link";
import { UploadCloud, Plus, FileDown, Mail } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FinancialKpis } from "@/components/dashboard/FinancialKpis";
import { VentureMetrics } from "@/components/dashboard/VentureMetrics";
import { CapitalLeakRadar } from "@/components/dashboard/CapitalLeakRadar";
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

  return (
    <div className="space-y-10 pb-16">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Executive Ledger • Fiscal Year 2026
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Financial Cockpit
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <Button variant="secondary" size="sm" onClick={() => setIsMemoOpen(true)}>
            <Mail size={13} className="mr-1.5" /> Investor Memo
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setIsCsvModalOpen(true)}>
            <UploadCloud size={13} className="mr-1.5" /> Import Statement
          </Button>
          <Link href="/reports">
            <Button variant="secondary" size="sm">
              <FileDown size={13} className="mr-1.5" /> Export Dossier
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsRecordModalOpen(true)}>
            <Plus size={13} className="mr-1" /> Record Entry
          </Button>
        </div>
      </div>

      {/* 1. Large Financial KPIs */}
      <FinancialKpis summary={summary} />

      {/* 2. Institutional Venture Health Index (Rule of 40 & Burn Multiple) */}
      <VentureMetrics />

      {/* 3. Autonomous Capital Leak & Anomaly Radar (Instant Value Engine) */}
      <CapitalLeakRadar />

      {/* 4. Goals & Milestones */}
      <FinancialGoals />

      {/* 5. Automated Financial Insights */}
      <FinancialInsights />

      {/* 6. Revenue Trajectory vs Operating Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <RevenueChart />
        </div>
        <div className="lg:col-span-4">
          <ExpenseBreakdown />
        </div>
      </div>

      {/* 7. General Ledger Table */}
      <RecentTransactions />

      {/* Modals */}
      <ImportCsvModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} />
      <InvestorMemoModal isOpen={isMemoOpen} onClose={() => setIsMemoOpen(false)} />
    </div>
  );
}
