"use client";
import React, { useState } from "react";
import { Trash2, Search, Filter } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export const RecentTransactions: React.FC = () => {
  const { transactions, deleteTransaction } = useFinancial();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const categories = ["All", "Revenue", "Payroll", "Software", "Marketing", "Professional Services"];

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#222222] gap-4">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Audit Log</span>
          <h3 className="font-serif text-2xl text-white font-light mt-1">General Ledger Records</h3>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <div className="flex items-center space-x-2 border border-[#222222] px-3 py-1.5 text-xs text-[#707070] bg-black">
            <Search size={12} />
            <input
              type="text"
              placeholder="Search reference..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-transparent text-xs text-white placeholder-[#505050] focus:outline-none w-36"
            />
          </div>

          <div className="flex items-center space-x-2 border border-[#222222] px-3 py-1.5 text-xs text-[#707070] bg-black">
            <Filter size={12} />
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-transparent text-xs text-white focus:outline-none cursor-pointer"
            >
              {categories.map((c) => (
                <option key={c} value={c} className="bg-neutral-900 text-white">
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs font-sans">
          <thead>
            <tr className="border-b border-[#222222] text-[10px] uppercase tracking-widest text-[#707070]">
              <th className="pb-3 font-normal">Reference</th>
              <th className="pb-3 font-normal">Description</th>
              <th className="pb-3 font-normal">Category</th>
              <th className="pb-3 font-normal">Posting Date</th>
              <th className="pb-3 font-normal text-right">Amount</th>
              <th className="pb-3 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c1c]">
            {filtered.map((tx) => (
              <tr key={tx.id} className="hover:bg-[#121212] transition-colors">
                <td className="py-3.5 text-[#707070] font-mono text-[11px]">{tx.id}</td>
                <td className="py-3.5 text-white font-light">{tx.description}</td>
                <td className="py-3.5">
                  <span className="text-[10px] tracking-wider uppercase border border-[#222222] px-2 py-0.5 text-[#A0A0A0]">
                    {tx.category}
                  </span>
                </td>
                <td className="py-3.5 text-[#707070] font-light">{tx.date}</td>
                <td
                  className={`py-3.5 text-right font-medium font-mono ${
                    tx.type === "income" ? "text-emerald-400" : "text-white"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}${tx.amount.toLocaleString()}
                </td>
                <td className="py-3.5 text-right">
                  <button
                    onClick={() => deleteTransaction(tx.id)}
                    className="text-[#505050] hover:text-red-400 transition-colors p-1 cursor-pointer"
                    title="Remove record"
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
            No transaction records match the specified filters.
          </div>
        )}
      </div>
    </div>
  );
};
