"use client";
import React, { useState } from "react";
import { Plus, Search, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { MotionWrapper } from "@/components/ui/MotionWrapper";
import { useFinancial } from "@/context/FinancialContext";

export default function RevenuePage() {
  const { transactions, summary, deleteTransaction, openRecordModal } = useFinancial();
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  const revenueTx = transactions.filter((t) => t.type === "income");

  const filtered = revenueTx.filter((t) => {
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
            Inflow Accounts • Accounts Receivable
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Revenue Management
          </h1>
        </div>
        <Button variant="primary" size="sm" onClick={() => openRecordModal("income")}>
          <Plus size={13} className="mr-1.5" /> Record Inflow
        </Button>
      </div>

      {/* Revenue KPI Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-white/[0.08] pb-10">
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Gross Inflows</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            ${summary.totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-400 mt-1 flex items-center">
            <ArrowUpRight size={13} className="mr-0.5" /> Verified top-line
          </span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Active Streams</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{revenueTx.length}</div>
          <span className="text-xs text-neutral-400 mt-1 block font-light">Recorded income receipts</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Collection Ratio</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">100%</div>
          <span className="text-xs text-emerald-400 mt-1 block">Settled ledger balance</span>
        </GlassCard>
        <GlassCard className="p-6">
          <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block mb-1">Avg Inflow</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            ${revenueTx.length > 0 ? Math.round(summary.totalRevenue / revenueTx.length).toLocaleString() : "0"}
          </div>
          <span className="text-xs text-neutral-400 mt-1 block font-light">Per closed transaction</span>
        </GlassCard>
      </div>

      {/* Inflow Ledger */}
      <GlassCard className="p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-white/[0.08] gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500">Verified Ledger</span>
            <h3 className="font-serif text-2xl text-white font-light mt-1">Recorded Inflow Transactions</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center space-x-2 border border-white/10 px-3 py-1.5 text-xs text-neutral-400 bg-black/60">
              <Search size={12} />
              <input
                type="text"
                placeholder="Search counterparty..."
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
              <option value="All" className="bg-neutral-900">All Inflow Streams</option>
              <option value="Revenue" className="bg-neutral-900">Direct Platform Revenue</option>
              <option value="Professional Services" className="bg-neutral-900">Advisory / Retainer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-white/[0.08] text-[10px] uppercase tracking-widest text-neutral-500">
                <th className="pb-3 font-normal">Reference</th>
                <th className="pb-3 font-normal">Counterparty / Description</th>
                <th className="pb-3 font-normal">Stream Category</th>
                <th className="pb-3 font-normal">Posting Date</th>
                <th className="pb-3 font-normal text-right">Inflow Amount</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="py-3.5 text-neutral-500 font-mono text-[11px]">{tx.id}</td>
                  <td className="py-3.5 text-white font-light">{tx.description}</td>
                  <td className="py-3.5">
                    <span className="text-[10px] uppercase tracking-widest border border-white/10 px-2 py-0.5 text-neutral-300">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-neutral-500 font-mono">{tx.date}</td>
                  <td className="py-3.5 text-right font-medium font-mono text-emerald-400">
                    +${tx.amount.toLocaleString()}
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
              No revenue inflow items recorded. Import a statement or record an entry.
            </div>
          )}
        </div>
      </GlassCard>
    </MotionWrapper>
  );
}
