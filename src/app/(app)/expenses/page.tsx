"use client";
import React, { useState } from "react";
import { Plus, Search, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { useFinancial } from "@/context/FinancialContext";

export default function ExpensesPage() {
  const { transactions, summary, deleteTransaction, openRecordModal } = useFinancial();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const expenseTx = transactions.filter((t) => t.type === "expense");
  const categories = ["All", "Payroll", "Software", "Marketing", "Operations", "Professional Services"];

  const filtered = expenseTx.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === "All" || t.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

  return (
    <MotionWrapper className="space-y-10 pb-16">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-white/[0.08]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block font-sans">
            Outflow Accounts • Cost Centers
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Expense Allocation
          </h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => openRecordModal("expense")}>
          <Plus size={13} className="mr-1.5" /> Record Expense
        </Button>
      </div>

      {/* Expense KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-white/[0.08] pb-10">
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Total Operating Pool</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            ${summary.totalExpenses.toLocaleString()}
          </div>
          <span className="text-xs text-neutral-400 mt-1 block font-light">Verified disbursements</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Monthly Burn Rate</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            ${Math.round(summary.totalExpenses / 3).toLocaleString()}
          </div>
          <span className="text-xs text-emerald-400 mt-1 block">Trailing average burn</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Audited Items</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{expenseTx.length}</div>
          <span className="text-xs text-neutral-400 mt-1 block font-light">Recorded cost center entries</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Capital Efficiency</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            {summary.totalRevenue > 0 ? (summary.totalExpenses / summary.totalRevenue).toFixed(2) : "0.00"}x
          </div>
          <span className="text-xs text-neutral-400 mt-1 block font-light">Burn multiple</span>
        </GlassCard>
      </div>

      {/* Expense Ledger */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.08] gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500">Audit Log</span>
            <h3 className="font-serif text-2xl text-white font-light mt-1">Disbursements Ledger</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center space-x-2 border border-white/10 px-3 py-1.5 text-xs text-neutral-400 bg-black/60">
              <Search size={12} />
              <input
                type="text"
                placeholder="Search vendor..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-neutral-600 focus:outline-none w-44 font-sans"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black/80 border border-white/10 px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-neutral-900">{c}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-widest text-neutral-500">
                <th className="pb-3 font-normal">Reference</th>
                <th className="pb-3 font-normal">Vendor / Description</th>
                <th className="pb-3 font-normal">Cost Center</th>
                <th className="pb-3 font-normal">Date Paid</th>
                <th className="pb-3 font-normal text-right">Amount</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 text-neutral-500 font-mono text-[11px]">{tx.id}</td>
                  <td className="py-3.5 text-white font-light">{tx.description}</td>
                  <td className="py-3.5">
                    <span className="text-[10px] uppercase tracking-widest border border-white/10 px-2 py-0.5 text-neutral-400">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-neutral-500 font-mono">{tx.date}</td>
                  <td className="py-3.5 text-right font-medium font-mono text-white">
                    -${tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-neutral-600 hover:text-red-400 transition-colors p-1 cursor-pointer"
                      title="Delete record"
                    >
                      <Trash2 size={13} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-neutral-500 text-xs font-light">
              No matching expense items recorded.
            </div>
          )}
        </div>
      </GlassCard>
    </MotionWrapper>
  );
}
