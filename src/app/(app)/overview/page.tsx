"use client";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { FinancialKpis } from "@/components/dashboard/FinancialKpis";
import { RevenueChart } from "@/components/dashboard/RevenueChart";
import { ExpenseBreakdown } from "@/components/dashboard/ExpenseBreakdown";
import { FinancialInsights } from "@/components/dashboard/FinancialInsights";
import { FinancialGoals } from "@/components/dashboard/FinancialGoals";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { useFinancial } from "@/context/FinancialContext";

export default function OverviewPage() {
  const { summary, setIsRecordModalOpen } = useFinancial();

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
        <div className="flex items-center space-x-3">
          <Link href="/reports">
            <Button variant="secondary" size="sm">
              Export Dossier
            </Button>
          </Link>
          <Button variant="primary" size="sm" onClick={() => setIsRecordModalOpen(true)}>
            + Record Transaction
          </Button>
        </div>
      </div>

      <FinancialKpis summary={summary} />
      <FinancialGoals />
      <FinancialInsights />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8">
          <RevenueChart />
        </div>
        <div className="lg:col-span-4">
          <ExpenseBreakdown />
        </div>
      </div>
      <RecentTransactions />
    </div>
  );
}
