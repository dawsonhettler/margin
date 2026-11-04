"use client";
import React, { useState } from "react";
import { Plus, Search, Trash2, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
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
    <div className="space-y-10 pb-16">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
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
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-[#222222] pb-10">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Gross Inflows</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">
            ${summary.totalRevenue.toLocaleString()}
          </div>
          <span className="text-xs text-emerald-500 mt-1 flex items-center">
            <ArrowUpRight size={13} className="mr-0.5" /> +21.4% YoY Velocity
          </span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Active Streams</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">{revenueTx.length}</div>
          <span className="text-xs text-[#707070] mt-1 block">Verified income contracts</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Primary Vehicle</span>
          <div className="font-serif text-2xl text-white font-light mt-1">Direct Platform</div>
          <span className="text-xs text-[#707070] mt-1 block">71% of total top-line</span>
        </div>
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Collection Ratio</span>
          <div className="font-serif text-3xl sm:text-4xl text-white font-light">98.2%</div>
          <span className="text-xs text-emerald-500 mt-1 block">Sub-15 day settlement</span>
        </div>
      </div>

      {/* Inflow Ledger */}
      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#222222] gap-4">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Verified Ledger</span>
            <h3 className="font-serif text-2xl text-white font-light mt-1">Recorded Inflow Transactions</h3>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <div className="flex items-center space-x-2 border border-[#222222] px-3 py-1.5 text-xs text-[#707070] bg-black">
              <Search size={12} />
              <input
                type="text"
                placeholder="Search counterparty..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-transparent text-xs text-white placeholder-[#505050] focus:outline-none w-44"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="bg-black border border-[#222222] px-3 py-1.5 text-xs text-white focus:outline-none cursor-pointer"
            >
              <option value="All">All Inflow Streams</option>
              <option value="Revenue">Direct Platform Revenue</option>
              <option value="Professional Services">Advisory / Retainer</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-sans">
            <thead>
              <tr className="border-b border-[#222222] text-[10px] uppercase tracking-widest text-[#707070]">
                <th className="pb-3 font-normal">Reference</th>
                <th className="pb-3 font-normal">Counterparty / Description</th>
                <th className="pb-3 font-normal">Stream Category</th>
                <th className="pb-3 font-normal">Posting Date</th>
                <th className="pb-3 font-normal text-right">Inflow Amount</th>
                <th className="pb-3 font-normal text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#1c1c1c]">
              {filtered.map((tx) => (
                <tr key={tx.id} className="hover:bg-[#121212] transition-colors">
                  <td className="py-3.5 text-[#707070] font-mono text-[11px]">{tx.id}</td>
                  <td className="py-3.5 text-white font-light">{tx.description}</td>
                  <td className="py-3.5">
                    <span className="text-[10px] uppercase tracking-widest border border-[#222222] px-2 py-0.5 text-[#A0A0A0]">
                      {tx.category}
                    </span>
                  </td>
                  <td className="py-3.5 text-[#707070]">{tx.date}</td>
                  <td className="py-3.5 text-right font-medium font-mono text-emerald-400">
                    +${tx.amount.toLocaleString()}
                  </td>
                  <td className="py-3.5 text-right">
                    <button
                      onClick={() => deleteTransaction(tx.id)}
                      className="text-[#505050] hover:text-red-400 transition-colors p-1 cursor-pointer"
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
            <div className="text-center py-12 text-[#707070] text-xs">
              No matching revenue inflow items recorded.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
