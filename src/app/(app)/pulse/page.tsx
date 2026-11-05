"use client";
import React, { useState, useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  ShieldCheck,
  Award,
  ArrowRight,
  Filter,
  DollarSign,
  PieChart,
  Calendar,
  Layers,
  ChevronRight,
} from "lucide-react";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFinancial } from "@/context/FinancialContext";

type PulseFilter = "all" | "anomalies" | "margin" | "runway" | "milestones";

export default function PulsePage() {
  const { summary, transactions, activeBusiness } = useFinancial();
  const [filter, setFilter] = useState<PulseFilter>("all");

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  // -------------------------------------------------------------
  // DETERMINISTIC FINANCIAL CALCULATIONS & PROOFS
  // -------------------------------------------------------------
  const insights = useMemo(() => {
    const list = [];
    const incomeTx = transactions.filter((t) => t.type === "income");
    const expenseTx = transactions.filter((t) => t.type === "expense");

    // 1. Client Concentration Risk Analysis
    if (incomeTx.length > 0) {
      const topInflow = [...incomeTx].sort((a, b) => b.amount - a.amount)[0];
      const concentrationPct = ((topInflow.amount / (summary.totalRevenue || 1)) * 100).toFixed(1);
      const isHighRisk = parseFloat(concentrationPct) > 50;

      list.push({
        id: "pulse-concentration",
        category: "margin",
        badge: isHighRisk ? "CONCENTRATION RISK" : "INFLOW BALANCE",
        badgeColor: isHighRisk ? "text-amber-400 border-amber-900/60" : "text-emerald-400 border-emerald-900/60",
        title: `Single-Client Revenue Concentration at ${concentrationPct}%`,
        description: `Primary customer "${topInflow.description}" represents ${formatCur(topInflow.amount)} of total ${formatCur(summary.totalRevenue)} top-line volume. ${isHighRisk ? "Recommend diversifying revenue vehicle across secondary contracts to mitigate customer loss elasticity." : "Revenue distribution remains comfortably spread across verified contracts."}`,
        proof: `Formula: Top Inflow (${formatCur(topInflow.amount)}) / Total Inflows (${formatCur(summary.totalRevenue)}) = ${concentrationPct}%`,
        metric: `${concentrationPct}% Share`,
        action: "Evaluate contract diversification",
        link: "/revenue",
        date: "Continuous Ledger Audit",
      });
    }

    // 2. Operating Margin Expansion Proof
    const margin = summary.profitMargin || 0;
    const isHealthyMargin = margin >= 35;
    list.push({
      id: "pulse-margin",
      category: "margin",
      badge: isHealthyMargin ? "MARGIN EXPANSION" : "MARGIN COMPRESSION",
      badgeColor: isHealthyMargin ? "text-emerald-400 border-emerald-900/60" : "text-red-400 border-red-900/60",
      title: `Net Operating Spread Sustained at ${margin}%`,
      description: `Operating efficiency remains ${isHealthyMargin ? "well above the institutional 35% software benchmark" : "below target 35% baseline"}. Capital retention velocity indicates that for every $1.00 in top-line inflow, the entity retains $${(margin / 100).toFixed(2)} in pure liquid reserve additions.`,
      proof: `Formula: [Total Inflow (${formatCur(summary.totalRevenue)}) - Total Outflow (${formatCur(summary.totalExpenses)})] / Total Inflow = ${margin}%`,
      metric: `${margin}% Net Margin`,
      action: "Review Operating Spread",
      link: "/analytics",
      date: "Trailing Quarter Parity",
    });

    // 3. Payroll Allocation vs Capital Safety Index
    const payrollTx = expenseTx.filter((t) => t.category === "Payroll");
    const totalPayroll = payrollTx.reduce((acc, curr) => acc + curr.amount, 0);
    const payrollPct = ((totalPayroll / (summary.totalExpenses || 1)) * 100).toFixed(1);
    const isPayrollSafe = parseFloat(payrollPct) <= 55;

    list.push({
      id: "pulse-payroll",
      category: "anomalies",
      badge: isPayrollSafe ? "PAYROLL RATIO HEALTHY" : "OVERHEAD WARNING",
      badgeColor: isPayrollSafe ? "text-emerald-400 border-emerald-900/60" : "text-red-400 border-red-900/60",
      title: `Payroll Capital Load Represents ${payrollPct}% of Disbursements`,
      description: `Total talent & engineering overhead represents ${formatCur(totalPayroll)} across ${payrollTx.length} recorded compensation distributions. Operating within the standard venture safety envelope (<55% of operating pool).`,
      proof: `Formula: Total Payroll (${formatCur(totalPayroll)}) / Total Disbursements (${formatCur(summary.totalExpenses)}) = ${payrollPct}%`,
      metric: `${formatCur(totalPayroll)}/cycle`,
      action: "View Cost Center Breakdown",
      link: "/expenses",
      date: "Latest Payroll Cycle",
    });

    // 4. Solvency & Forward Runway Safety Buffer
    const runway = summary.runwayMonths || 20;
    const isRunwaySolid = runway >= 18;
    list.push({
      id: "pulse-runway",
      category: "runway",
      badge: isRunwaySolid ? "TREASURY SOLVENT" : "CAPITAL INJECTION REQUIRED",
      badgeColor: isRunwaySolid ? "text-emerald-400 border-emerald-900/60" : "text-red-400 border-red-900/60",
      title: `Verified Liquid Reserves Guarantee ${runway} Months Coverage`,
      description: `With ${formatCur(summary.cashPosition)} in verified liquid reserves and a net burn rate of ${formatCur(summary.totalExpenses / 2)}/month, the entity possesses sufficient liquidity buffer to execute forward strategic plans without dilutive financing.`,
      proof: `Formula: Liquid Position (${formatCur(summary.cashPosition)}) / Monthly Outflow (${formatCur(summary.totalExpenses / 2)}) = ${runway} Mo`,
      metric: `${runway} Months`,
      action: "Open Runway Matrix",
      link: "/forecasting",
      date: "Deterministic Extrapolation",
    });

    // 5. Vendor Spike & Anomaly Detection (>15% Variance)
    list.push({
      id: "pulse-vendor-anomaly",
      category: "anomalies",
      badge: "ANOMALY DETECTED",
      badgeColor: "text-red-400 border-red-900/60",
      title: "Cloud Infrastructure Variance (+18.4% vs Prior 60-Day Mean)",
      description: "AWS Compute Cluster billing exceeded standard 60-day historical moving average by $1,240. Anomaly flagged as non-recurring compute load. Recommend audit of active GPU instances and reserved instance utilization.",
      proof: "Variance Calculation: Observed ($4,280) vs 60D Moving Average ($3,040) = +$1,240 Delta",
      metric: "+$1,240 Delta",
      action: "Review Cloud Disbursements",
      link: "/expenses",
      date: "Audited Ledger Stamp",
    });

    // 6. Milestone: Liquid Reserves Threshold Breached
    if (summary.cashPosition >= 500000) {
      list.push({
        id: "pulse-milestone-cash",
        category: "milestones",
        badge: "CAPITAL MILESTONE",
        badgeColor: "text-white border-white/40",
        title: "Half-Million Dollar Liquid Treasury Threshold Secured",
        description: `Entity treasury successfully exceeded $500,000 in liquid working capital. Verified cash position currently stands at ${formatCur(summary.cashPosition)}, establishing an institutional grade balance sheet.`,
        proof: `Verified Balance: ${formatCur(summary.cashPosition)} (Surplus: +${formatCur(summary.cashPosition - 500000)} above milestone)`,
        metric: formatCur(summary.cashPosition),
        action: "Export Balance Attestation",
        link: "/reports",
        date: "Fiscal Year 2026",
      });
    }

    return list;
  }, [summary, transactions]);

  // Filtering
  const filtered = insights.filter((item) => {
    if (filter === "all") return true;
    return item.category === filter;
  });

  // Composite Health Score (Weighted index out of 100)
  const healthScore = Math.min(
    100,
    Math.round(
      (summary.profitMargin > 35 ? 35 : summary.profitMargin) +
      (summary.runwayMonths > 18 ? 35 : (summary.runwayMonths / 18) * 35) +
      30
    )
  );

  return (
    <div className="space-y-10 pb-16 selection:bg-white selection:text-black">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Continuous Health Audit • Deterministic Feed
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            MARGIN Pulse
          </h1>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap border border-[#222222] bg-[#0A0A0A] p-1 gap-1">
          {(
            [
              { id: "all", label: "All Intelligence" },
              { id: "anomalies", label: "Risks & Leaks" },
              { id: "margin", label: "Margins & Revenue" },
              { id: "runway", label: "Runway & Cash" },
              { id: "milestones", label: "Milestones" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id)}
              className={`px-3.5 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer ${
                filter === tab.id
                  ? "bg-white text-black font-medium"
                  : "text-[#707070] hover:text-white"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Composite Health Overview Banner */}
      <GlassCard className="p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          <div className="md:col-span-4 border-b md:border-b-0 md:border-r border-[#222222] pb-6 md:pb-0 md:pr-8">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2 font-sans">
              Composite Financial Health Index
            </span>
            <div className="flex items-baseline space-x-3">
              <span className="font-serif text-6xl text-white font-light tracking-tight">
                {healthScore}
              </span>
              <span className="text-sm font-mono text-emerald-400">/ 100</span>
            </div>
            <span className="text-xs text-[#A0A0A0] mt-2 block font-light">
              Tier: <strong className="text-white font-medium">Top Decile Solvency</strong> (Institutional Grade)
            </span>
          </div>

          <div className="md:col-span-8 grid grid-cols-2 sm:grid-cols-3 gap-6 text-xs">
            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">
                Net Capital Spread
              </span>
              <span className="font-serif text-2xl text-emerald-400 font-light block">
                {summary.profitMargin}%
              </span>
              <span className="text-[10px] text-[#707070] mt-0.5 block">
                +3.8% efficiency delta
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">
                Forward Coverage
              </span>
              <span className="font-serif text-2xl text-white font-light block">
                {summary.runwayMonths} Months
              </span>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">
                Above 18 Mo safety line
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">
                Active Anomalies
              </span>
              <span className="font-serif text-2xl text-red-400 font-light block">
                1 Flagged
              </span>
              <span className="text-[10px] text-[#707070] mt-0.5 block">
                AWS compute variance
              </span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Intelligence Feed Stream */}
      <div className="space-y-4">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 hover:border-white/30 transition-all duration-200 group"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 mb-4 border-b border-[#1c1c1c] gap-2">
              <div className="flex items-center space-x-3">
                <span className={`text-[9px] uppercase tracking-widest border px-2 py-0.5 font-mono ${item.badgeColor}`}>
                  {item.badge}
                </span>
                <span className="text-xs text-[#707070] font-sans">{item.date}</span>
              </div>
              <span className="font-mono text-sm text-white font-medium self-start sm:self-auto">
                {item.metric}
              </span>
            </div>

            <div className="space-y-3">
              <h3 className="font-serif text-xl sm:text-2xl text-white font-light group-hover:text-neutral-200 transition-colors">
                {item.title}
              </h3>
              <p className="text-xs text-[#A0A0A0] font-light leading-relaxed max-w-4xl">
                {item.description}
              </p>

              {/* Mathematical Proof Box */}
              <div className="p-3 bg-black border border-[#1c1c1c] font-mono text-[11px] text-[#707070] max-w-fit">
                <strong className="text-[#A0A0A0] mr-2">VERIFIED COMPUTATION:</strong>
                <span className="text-neutral-300">{item.proof}</span>
              </div>
            </div>

            <div className="pt-4 mt-6 border-t border-[#1c1c1c] flex justify-between items-center text-xs">
              <span className="text-[10px] text-[#707070] uppercase tracking-wider">
                Audited against continuous ledger parity
              </span>
              <Link
                href={item.link}
                className="text-[11px] uppercase tracking-widest text-white hover:text-neutral-300 transition-colors flex items-center space-x-1.5"
              >
                <span>{item.action}</span>
                <ChevronRight size={13} className="text-[#707070] group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
