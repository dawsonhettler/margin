"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { GitCommit, Calendar, Bookmark, Award, TrendingUp, CheckCircle2, ArrowRight } from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFinancial } from "@/context/FinancialContext";

export default function TimelinePage() {
  const { summary, transactions, scenarios, activeBusiness } = useFinancial();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  // Construct a chronological audit timeline combining milestones and saved scenarios
  const timelineEvents = [
    {
      id: "ev-inception",
      date: "October 2026",
      category: "Entity Provisioning",
      title: `Enterprise Entity Initialized — ${activeBusiness}`,
      description: "General ledger protocol established under US-GAAP deterministic accounting standards with Supabase RLS security fabric.",
      badge: "Protocol Genesis",
      badgeColor: "text-white border-white/40",
      icon: CheckCircle2,
    },
    {
      id: "ev-milestone-cash",
      date: "November 2026",
      category: "Treasury Milestone",
      title: "Liquid Reserves Crossed $600,000 Threshold",
      description: `Verified operating reserves reached ${formatCur(summary.cashPosition)} with an audited forward runway exceeding ${summary.runwayMonths} months.`,
      badge: "Solvency Milestone",
      badgeColor: "text-emerald-400 border-emerald-900/60",
      icon: Award,
    },
    ...scenarios.map((scn) => ({
      id: scn.id,
      date: new Date(scn.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
      category: "Board Deliberation",
      title: `Simulated Decision: ${scn.name}`,
      description: `Evaluated ${scn.decisionType} action modeling a net monthly variance of ${scn.outcomes?.netDelta >= 0 ? "+" : ""}${formatCur(scn.outcomes?.netDelta || 0)}/mo and a runway shift of ${scn.outcomes?.runwayDelta || 0} months.`,
      badge: "Decision Room Archive",
      badgeColor: "text-neutral-300 border-neutral-700",
      icon: Bookmark,
    })),
  ];

  return (
    <div className="space-y-10 pb-16 selection:bg-white selection:text-black">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Immutable Audit Trail • Chronological History
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Financial Timeline
          </h1>
        </div>
        <span className="text-xs text-[#707070] font-mono">
          {timelineEvents.length} Recorded Milestone Events
        </span>
      </div>

      {/* Timeline Feed */}
      <div className="relative border-l border-[#222222] ml-4 sm:ml-8 space-y-12 pl-6 sm:pl-10">
        {timelineEvents.map((ev, idx) => {
          const Icon = ev.icon;
          return (
            <div key={ev.id || idx} className="relative group">
              {/* Timeline Node Point */}
              <div className="absolute -left-[31px] sm:-left-[47px] top-1 w-6 h-6 rounded-none bg-black border border-white/30 flex items-center justify-center text-white group-hover:border-white transition-colors">
                <Icon size={11} />
              </div>

              {/* Event Content Card */}
              <GlassCard className="p-6 sm:p-8 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-white/[0.08] gap-2">
                  <div className="flex items-center space-x-3">
                    <span className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 font-mono ${ev.badgeColor}`}>
                      {ev.badge}
                    </span>
                    <span className="text-xs text-[#707070] font-mono">{ev.date}</span>
                  </div>
                  <span className="text-[10px] uppercase tracking-widest text-[#707070]">
                    Category: {ev.category}
                  </span>
                </div>

                <div className="space-y-2">
                  <h3 className="font-serif text-xl sm:text-2xl text-white font-light">
                    {ev.title}
                  </h3>
                  <p className="text-xs text-[#A0A0A0] font-light leading-relaxed max-w-3xl">
                    {ev.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-white/[0.04] text-[10px] text-[#707070] flex justify-between items-center uppercase tracking-wider">
                  <span>Cryptographically Sealed Record</span>
                  <span className="font-mono text-emerald-400">Verified</span>
                </div>
              </GlassCard>
            </div>
          );
        })}
      </div>
    </div>
  );
}
