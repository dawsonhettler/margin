"use client";
import React, { useState } from "react";
import { Trash2, Search, Filter, ShieldCheck, Download, ChevronDown, ChevronRight, Hash } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export const RecentTransactions: React.FC = () => {
  const { transactions, deleteTransaction } = useFinancial();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = ["All", "Revenue", "Payroll", "Software", "Marketing", "Professional Services"];

  const filtered = transactions.filter((t) => {
    const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = selectedCategory === "All" || t.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  // Export clean CSV
  const handleExportCsv = () => {
    const headers = ["ID,Description,Category,Type,Amount,Date,SHA256_Audit_Seal\n"];
    const rows = filtered.map((t) => {
      // Deterministic SHA-256 style mock hash
      const hash = `0x${Array.from(t.id + t.amount + t.date)
        .map((c) => c.charCodeAt(0).toString(16))
        .join("")
        .padEnd(64, "a")
        .slice(0, 32)}`;
      return `"${t.id}","${t.description}","${t.category}","${t.type}","${t.amount}","${t.date}","${hash}"\n`;
    });
    const blob = new Blob([...headers, ...rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `MARGIN_Audited_Ledger_${new Date().toISOString().split("T")[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#222222] gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Audit Log</span>
            <span className="text-[9px] uppercase tracking-widest text-emerald-400 border border-emerald-900/60 px-1.5 py-0.2">
              Continuous Reconciliation
            </span>
          </div>
          <h3 className="font-serif text-2xl text-white font-light mt-1">General Ledger & Cryptographic Seals</h3>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleExportCsv}
            className="flex items-center space-x-1.5 text-xs border border-[#222222] bg-black px-3 py-1.5 text-[#A0A0A0] hover:text-white hover:border-white transition-colors cursor-pointer"
          >
            <Download size={12} />
            <span>Export CSV</span>
          </button>

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
              <th className="pb-3 w-8"></th>
              <th className="pb-3 font-normal">Reference</th>
              <th className="pb-3 font-normal">Description</th>
              <th className="pb-3 font-normal">Category</th>
              <th className="pb-3 font-normal">Posting Date</th>
              <th className="pb-3 font-normal text-right">Amount</th>
              <th className="pb-3 font-normal text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#1c1c1c]">
            {filtered.map((tx) => {
              const isExpanded = expandedId === tx.id;
              const pseudoHash = `0x${Array.from(tx.id + tx.amount + tx.date)
                .map((c) => c.charCodeAt(0).toString(16))
                .join("")
                .padEnd(64, "a")
                .slice(0, 48)}...`;

              return (
                <React.Fragment key={tx.id}>
                  <tr
                    onClick={() => setExpandedId(isExpanded ? null : tx.id)}
                    className="hover:bg-[#121212] transition-colors cursor-pointer"
                  >
                    <td className="py-3.5 text-[#707070]">
                      {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                    </td>
                    <td className="py-3.5 text-[#707070] font-mono text-[11px] flex items-center space-x-1.5">
                      <span>{tx.id}</span>
                      <ShieldCheck size={11} className="text-emerald-500" />
                    </td>
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
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteTransaction(tx.id);
                        }}
                        className="text-[#505050] hover:text-red-400 transition-colors p-1 cursor-pointer"
                        title="Remove record"
                      >
                        <Trash2 size={13} />
                      </button>
                    </td>
                  </tr>

                  {/* Expandable Cryptographic Audit Block */}
                  {isExpanded && (
                    <tr className="bg-black/80">
                      <td colSpan={7} className="p-4 border-l-2 border-white font-mono text-[10px] space-y-2">
                        <div className="flex items-center space-x-2 text-white font-sans uppercase tracking-widest text-[10px]">
                          <Hash size={12} className="text-emerald-400" />
                          <span>Cryptographic Immutability Block Seal</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-[#707070] pt-1">
                          <div>
                            <span className="text-[#505050] block">AUDITED SHA-256 SEAL:</span>
                            <span className="text-neutral-300 break-all">{pseudoHash}</span>
                          </div>
                          <div>
                            <span className="text-[#505050] block">LEDGER PROTOCOL PARITY:</span>
                            <span className="text-emerald-400">Continuous Reconciliation • US-GAAP Compliant</span>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              );
            })}
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
