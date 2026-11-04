"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  BarChart3,
  TrendingUp,
  Receipt,
  LineChart,
  Sliders,
  Bot,
  FileDown,
  UploadCloud,
  Plus,
  ArrowRight,
  X,
  CreditCard,
} from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenImportCsv?: () => void;
}

export const CommandPalette: React.FC<Props> = ({ isOpen, onClose, onOpenImportCsv }) => {
  const router = useRouter();
  const { transactions, openRecordModal } = useFinancial();
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Close on Escape, Open on Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === "Escape" && isOpen) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // Reset index on search
  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Static Platform Actions
  const staticActions = [
    {
      id: "act-income",
      title: "Record Inflow / Income",
      category: "Action",
      icon: Plus,
      run: () => { openRecordModal("income"); onClose(); },
    },
    {
      id: "act-expense",
      title: "Record Operating Disbursement",
      category: "Action",
      icon: Plus,
      run: () => { openRecordModal("expense"); onClose(); },
    },
    {
      id: "act-import",
      title: "Import Bank & Stripe Statement (CSV)",
      category: "Action",
      icon: UploadCloud,
      run: () => { if (onOpenImportCsv) onOpenImportCsv(); onClose(); },
    },
    {
      id: "act-export",
      title: "Export P&L & Balance Sheet Dossier (PDF)",
      category: "Action",
      icon: FileDown,
      run: () => { router.push("/reports"); onClose(); },
    },
    {
      id: "nav-overview",
      title: "Go to Financial Cockpit",
      category: "Navigation",
      icon: LayoutDashboard,
      run: () => { router.push("/overview"); onClose(); },
    },
    {
      id: "nav-simulator",
      title: "Go to Business Simulator (Headcount / Pricing)",
      category: "Navigation",
      icon: Sliders,
      run: () => { router.push("/simulator"); onClose(); },
    },
    {
      id: "nav-forecasting",
      title: "Go to Cash Flow Forecasting",
      category: "Navigation",
      icon: LineChart,
      run: () => { router.push("/forecasting"); onClose(); },
    },
    {
      id: "nav-copilot",
      title: "Go to Executive AI Copilot",
      category: "Navigation",
      icon: Bot,
      run: () => { router.push("/copilot"); onClose(); },
    },
    {
      id: "nav-analytics",
      title: "Go to Financial Analytics",
      category: "Navigation",
      icon: BarChart3,
      run: () => { router.push("/analytics"); onClose(); },
    },
  ];

  // Dynamic Ledger Search Results
  const matchingTransactions = query.trim()
    ? transactions
        .filter((t) =>
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.amount.toString().includes(query) ||
          t.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map((t) => ({
          id: `tx-${t.id}`,
          title: `${t.description} — ${t.type === "income" ? "+" : "-"}$${t.amount.toLocaleString()} (${t.category})`,
          category: "General Ledger Record",
          icon: t.type === "income" ? TrendingUp : Receipt,
          run: () => {
            router.push(t.type === "income" ? "/revenue" : "/expenses");
            onClose();
          },
        }))
    : [];

  const filteredActions = staticActions.filter((a) =>
    a.title.toLowerCase().includes(query.toLowerCase()) ||
    a.category.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...filteredActions, ...matchingTransactions];

  // Keyboard Up/Down navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (allItems.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + allItems.length) % (allItems.length || 1));
    } else if (e.key === "Enter" && allItems[selectedIndex]) {
      e.preventDefault();
      allItems[selectedIndex].run();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-md pt-[15vh] p-4">
      <div className="bg-[#0A0A0A] border border-[#222222] w-full max-w-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-100">
        {/* Search Input Bar */}
        <div className="flex items-center px-4 py-3.5 border-b border-[#222222] bg-black">
          <Search size={16} className="text-[#707070] mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command, navigate, or search ledger..."
            className="w-full bg-transparent text-sm text-white placeholder-[#505050] focus:outline-none font-sans"
            autoFocus
          />
          <button
            onClick={onClose}
            className="text-[10px] tracking-widest uppercase border border-[#222222] px-2 py-1 text-[#707070] hover:text-white"
          >
            ESC
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-80 overflow-y-auto divide-y divide-[#161616]">
          {allItems.length === 0 ? (
            <div className="py-12 text-center text-xs text-[#707070]">
              No matching commands or ledger entries found.
            </div>
          ) : (
            allItems.map((item, idx) => {
              const Icon = item.icon;
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={item.id}
                  onClick={item.run}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between px-4 py-3 cursor-pointer text-xs transition-colors ${
                    isSelected ? "bg-[#161616] text-white" : "text-[#A0A0A0] hover:bg-[#121212]"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <Icon size={14} className={isSelected ? "text-white" : "text-[#707070]"} />
                    <span className="font-light truncate">{item.title}</span>
                  </div>
                  <div className="flex items-center space-x-2 shrink-0 ml-3">
                    <span className="text-[9px] uppercase tracking-widest text-[#505050] border border-[#222222] px-1.5 py-0.5">
                      {item.category}
                    </span>
                    {isSelected && <ArrowRight size={11} className="text-white" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Meta */}
        <div className="px-4 py-2 border-t border-[#1c1c1c] bg-black flex justify-between text-[10px] text-[#505050] tracking-wider uppercase">
          <span>Navigate with ↑ ↓ and Enter</span>
          <span>MARGIN Intelligence Terminal</span>
        </div>
      </div>
    </div>
  );
};
