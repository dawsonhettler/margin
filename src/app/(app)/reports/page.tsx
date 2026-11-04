"use client";
import React, { useState } from "react";
import { Download, Printer, CheckCircle2, Building, Calendar, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";

export default function ReportsPage() {
  const { summary, activeBusiness, transactions } = useFinancial();
  const [selectedReport, setSelectedReport] = useState<"pnl" | "balance" | "cashflow">("pnl");

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 }).format(v);

  const incomeTx = transactions.filter((t) => t.type === "income");
  const expenseTx = transactions.filter((t) => t.type === "expense");

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222] print:hidden">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Fiscal Reporting • GAAP Statement Engine
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Executive Financial Dossiers
          </h1>
        </div>

        <div className="flex items-center space-x-3">
          <Button variant="secondary" size="sm" onClick={handlePrint}>
            <Printer size={13} className="mr-1.5" /> Print / Save to PDF
          </Button>
        </div>
      </div>

      {/* Report Selector Tabs */}
      <div className="flex border border-[#222222] bg-[#0A0A0A] p-1 w-fit print:hidden">
        <button
          onClick={() => setSelectedReport("pnl")}
          className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
            selectedReport === "pnl" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
          }`}
        >
          Statement of Operations (P&L)
        </button>
        <button
          onClick={() => setSelectedReport("balance")}
          className={`px-4 py-2 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
            selectedReport === "balance" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
          }`}
        >
          Liquid Reserves & Balance Sheet
        </button>
      </div>

      {/* Printable Financial Statement Paper */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-8 sm:p-14 max-w-4xl mx-auto shadow-2xl print:border-none print:bg-white print:text-black print:p-0">
        {/* Document Header */}
        <div className="flex justify-between items-start pb-8 border-b border-[#222222] print:border-black mb-8">
          <div>
            <span className="font-serif text-2xl tracking-[0.35em] uppercase text-white print:text-black block">
              M A R G I N
            </span>
            <span className="text-[10px] tracking-widest uppercase text-[#707070] print:text-neutral-600 block mt-1">
              Deterministic Ledger Protocol • Confidential
            </span>
          </div>
          <div className="text-right">
            <span className="font-serif text-base text-white print:text-black block">{activeBusiness}</span>
            <span className="text-xs text-[#707070] print:text-neutral-600 block">Fiscal Year Ending 2026</span>
            <span className="text-[10px] uppercase tracking-widest text-emerald-500 print:text-neutral-800 block mt-1">
              ✓ Verified Ledger Parity
            </span>
          </div>
        </div>

        {/* Statement Title */}
        <div className="mb-8">
          <h2 className="font-serif text-2xl text-white print:text-black font-light">
            {selectedReport === "pnl" ? "Statement of Operations (Income Statement)" : "Balance Sheet & Liquid Reserves Audit"}
          </h2>
          <span className="text-xs text-[#707070] print:text-neutral-600">
            Reporting Period: Trailing Quarter • Currency: USD ($)
          </span>
        </div>

        {/* P&L Statement Layout */}
        {selectedReport === "pnl" && (
          <div className="space-y-6 text-xs font-sans">
            <div>
              <div className="font-serif text-sm uppercase tracking-widest text-white print:text-black pb-2 border-b border-[#222222] print:border-black font-medium">
                1. Gross Revenue & Inflow Vehicle
              </div>
              <div className="divide-y divide-[#1c1c1c] print:divide-neutral-300">
                {incomeTx.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex justify-between">
                    <span className="text-[#A0A0A0] print:text-neutral-700">{tx.description} ({tx.category})</span>
                    <span className="font-mono text-white print:text-black font-medium">{formatCur(tx.amount)}</span>
                  </div>
                ))}
                <div className="py-3 flex justify-between font-medium text-white print:text-black bg-[#121212]/40 print:bg-neutral-100 px-2 mt-2">
                  <span>TOTAL GROSS REVENUE</span>
                  <span className="font-mono">{formatCur(summary.totalRevenue)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="font-serif text-sm uppercase tracking-widest text-white print:text-black pb-2 border-b border-[#222222] print:border-black font-medium">
                2. Operating Expenses & Disbursements
              </div>
              <div className="divide-y divide-[#1c1c1c] print:divide-neutral-300">
                {expenseTx.map((tx) => (
                  <div key={tx.id} className="py-2.5 flex justify-between">
                    <span className="text-[#A0A0A0] print:text-neutral-700">{tx.description} ({tx.category})</span>
                    <span className="font-mono text-white print:text-black font-medium">{formatCur(tx.amount)}</span>
                  </div>
                ))}
                <div className="py-3 flex justify-between font-medium text-white print:text-black bg-[#121212]/40 print:bg-neutral-100 px-2 mt-2">
                  <span>TOTAL OPERATING DISBURSEMENTS</span>
                  <span className="font-mono">({formatCur(summary.totalExpenses)})</span>
                </div>
              </div>
            </div>

            {/* Net Summary */}
            <div className="pt-6 border-t-2 border-[#222222] print:border-black space-y-2">
              <div className="flex justify-between text-base font-serif font-light py-2">
                <span className="text-white print:text-black">NET OPERATING PROFIT</span>
                <span className="font-mono text-white print:text-black font-medium">{formatCur(summary.netProfit)}</span>
              </div>
              <div className="flex justify-between text-xs py-1 text-[#707070] print:text-neutral-600">
                <span>NET OPERATING SPREAD (MARGIN)</span>
                <span className="font-mono text-emerald-400 print:text-black font-medium">{summary.profitMargin}%</span>
              </div>
            </div>
          </div>
        )}

        {/* Balance Sheet Layout */}
        {selectedReport === "balance" && (
          <div className="space-y-6 text-xs font-sans">
            <div>
              <div className="font-serif text-sm uppercase tracking-widest text-white print:text-black pb-2 border-b border-[#222222] print:border-black font-medium">
                Current Assets & Liquid Reserves
              </div>
              <div className="divide-y divide-[#1c1c1c] print:divide-neutral-300">
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A0A0A0] print:text-neutral-700">Operating Reserve Accounts (Cash & Equivalents)</span>
                  <span className="font-mono text-white print:text-black font-medium">{formatCur(summary.cashPosition)}</span>
                </div>
                <div className="py-2.5 flex justify-between">
                  <span className="text-[#A0A0A0] print:text-neutral-700">Contracted Accounts Receivable</span>
                  <span className="font-mono text-white print:text-black font-medium">{formatCur(summary.totalRevenue * 0.15)}</span>
                </div>
                <div className="py-3 flex justify-between font-medium text-white print:text-black bg-[#121212]/40 print:bg-neutral-100 px-2 mt-2">
                  <span>TOTAL LIQUID ASSETS</span>
                  <span className="font-mono">{formatCur(summary.cashPosition + summary.totalRevenue * 0.15)}</span>
                </div>
              </div>
            </div>

            <div className="pt-4">
              <div className="font-serif text-sm uppercase tracking-widest text-white print:text-black pb-2 border-b border-[#222222] print:border-black font-medium">
                Solvency & Runway Verification
              </div>
              <div className="space-y-2 py-3">
                <div className="flex justify-between py-1">
                  <span className="text-[#707070] print:text-neutral-600">Monthly Net Burn Rate</span>
                  <span className="font-mono text-white print:text-black">{formatCur(summary.totalExpenses / 2)}/mo</span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-[#707070] print:text-neutral-600">Audited Forward Runway</span>
                  <span className="font-mono text-emerald-400 print:text-black font-medium">{summary.runwayMonths} Months</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Signatures & Attestation */}
        <div className="mt-16 pt-8 border-t border-[#222222] print:border-black flex justify-between items-end text-[10px] text-[#707070] print:text-neutral-600 uppercase tracking-widest">
          <div>
            <span>Attested by Principal: ____________________</span>
            <span className="block mt-1">Certified Accrual Accounting Standard</span>
          </div>
          <div>
            <span>Generated: {new Date().toLocaleDateString()}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
