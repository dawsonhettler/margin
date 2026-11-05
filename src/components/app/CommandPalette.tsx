"use client";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Search,
  LayoutDashboard,
  Compass,
  Activity,
  Award,
  GitCommit,
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
  Sparkles,
  Layers,
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

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  // Linear-style command catalog with keyboard shortcut badges
  const actions = [
    {
      id: "act-income",
      title: "Record Inflow / Income Transaction",
      shortcut: "I",
      category: "Ledger Action",
      icon: Plus,
      run: () => { openRecordModal("income"); onClose(); },
    },
    {
      id: "act-expense",
      title: "Record Operating Disbursement",
      shortcut: "E",
      category: "Ledger Action",
      icon: Plus,
      run: () => { openRecordModal("expense"); onClose(); },
    },
    {
      id: "act-import",
      title: "Import Bank & Stripe Statement (CSV)",
      shortcut: "⇧I",
      category: "Data Ingestion",
      icon: UploadCloud,
      run: () => { if (onOpenImportCsv) onOpenImportCsv(); onClose(); },
    },
    {
      id: "act-export",
      title: "Export P&L & Balance Sheet Dossier (PDF)",
      shortcut: "P",
      category: "Reporting",
      icon: FileDown,
      run: () => { router.push("/reports"); onClose(); },
    },
    {
      id: "nav-overview",
      title: "Go to Financial Cockpit",
      shortcut: "G O",
      category: "Navigation",
      icon: LayoutDashboard,
      run: () => { router.push("/overview"); onClose(); },
    },
    {
      id: "nav-decision",
      title: "Open Decision Room War Room",
      shortcut: "G D",
      category: "Navigation",
      icon: Compass,
      run: () => { router.push("/decision-room"); onClose(); },
    },
    {
      id: "nav-pulse",
      title: "View Pulse Feed & Health Anomalies",
      shortcut: "G U",
      category: "Navigation",
      icon: Activity,
      run: () => { router.push("/pulse"); onClose(); },
    },
    {
      id: "nav-simulator",
      title: "Launch Business Simulator & Monte Carlo",
      shortcut: "G S",
      category: "Navigation",
      icon: Sliders,
      run: () => { router.push("/simulator"); onClose(); },
    },
    {
      id: "nav-copilot",
      title: "Engage Gemini AI Intelligence Copilot",
      shortcut: "G C",
      category: "Navigation",
      icon: Bot,
      run: () => { router.push("/copilot"); onClose(); },
    },
    {
      id: "nav-benchmarks",
      title: "View Business Benchmarks Matrix",
      shortcut: "G B",
      category: "Navigation",
      icon: Award,
      run: () => { router.push("/benchmarks"); onClose(); },
    },
    {
      id: "nav-timeline",
      title: "Open Financial Timeline Audit Log",
      shortcut: "G T",
      category: "Navigation",
      icon: GitCommit,
      run: () => { router.push("/timeline"); onClose(); },
    },
  ];

  const matchingTransactions = query.trim()
    ? (transactions || [])
        .filter((t) =>
          t.description.toLowerCase().includes(query.toLowerCase()) ||
          t.amount.toString().includes(query) ||
          t.category.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 5)
        .map((t) => ({
          id: `tx-${t.id}`,
          title: `${t.description} — ${t.type === "income" ? "+" : "-"}$${t.amount.toLocaleString()} (${t.category})`,
          shortcut: t.type === "income" ? "IN" : "EX",
          category: "Ledger Record",
          icon: t.type === "income" ? TrendingUp : Receipt,
          run: () => {
            router.push(t.type === "income" ? "/revenue" : "/expenses");
            onClose();
          },
        }))
    : [];

  const filteredActions = actions.filter(
    (a) =>
      a.title.toLowerCase().includes(query.toLowerCase()) ||
      a.category.toLowerCase().includes(query.toLowerCase())
  );

  const allItems = [...filteredActions, ...matchingTransactions];

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
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/85 backdrop-blur-xl pt-[14vh] p-4 animate-in fade-in duration-200">
      <div className="liquid-glass-elevated w-full max-w-2xl overflow-hidden shadow-[0_25px_70px_rgba(0,0,0,0.9)] border border-white/15">
        
        {/* Linear Search Input Header */}
        <div className="flex items-center px-5 py-4 border-b border-white/[0.08] bg-black/40">
          <Search size={16} className="text-neutral-400 mr-3.5 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command or search ledger records..."
            className="w-full bg-transparent text-sm text-white placeholder-neutral-500 focus:outline-none font-sans tracking-wide"
            autoFocus
          />
          <span className="text-[9px] font-mono tracking-widest text-neutral-500 border border-white/10 px-2 py-1 bg-white/[0.03]">
            ESC
          </span>
        </div>

        {/* Linear Command Results List */}
        <div className="max-h-96 overflow-y-auto p-2 space-y-1">
          {allItems.length === 0 ? (
            <div className="py-14 text-center text-xs text-neutral-500 font-light">
              No matching commands or ledger records found.
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
                  className={`flex items-center justify-between px-3.5 py-3 cursor-pointer text-xs transition-all rounded-sm ${
                    isSelected
                      ? "bg-white/[0.09] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                      : "text-neutral-400 hover:text-white hover:bg-white/[0.04]"
                  }`}
                >
                  <div className="flex items-center space-x-3 truncate">
                    <div className={`p-1.5 rounded-sm border ${isSelected ? "border-white/30 bg-white/10 text-white" : "border-white/10 bg-black text-neutral-400"}`}>
                      <Icon size={13} />
                    </div>
                    <span className="font-light tracking-wide truncate">{item.title}</span>
                  </div>

                  <div className="flex items-center space-x-2.5 shrink-0 ml-3">
                    <span className="text-[9px] uppercase tracking-widest text-neutral-500 font-mono">
                      {item.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 border border-white/10 bg-black/60 text-neutral-300">
                      {item.shortcut}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-white/[0.06] bg-black/60 flex justify-between text-[10px] text-neutral-500 tracking-widest uppercase font-mono">
          <span>Navigate with ↑ ↓ and Enter</span>
          <span>MARGIN Command Interface</span>
        </div>

      </div>
    </div>
  );
};
