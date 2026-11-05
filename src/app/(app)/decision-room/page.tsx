"use client";
import React, { useState, useEffect, useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import {
  Users,
  Tag,
  Megaphone,
  Building,
  Package,
  Sliders,
  Check,
  BookmarkPlus,
  Trash2,
  TrendingUp,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { GlassCard } from "@/components/ui/GlassCard";
import { useFinancial } from "@/context/FinancialContext";

type DecisionType = "hiring" | "pricing" | "ads" | "expansion" | "product";
type CaseMode = "expected" | "best" | "worst";

export default function DecisionRoomPage() {
  const { summary, scenarios, saveScenario, deleteScenario } = useFinancial();
  const [mounted, setMounted] = useState(false);
  const [decisionType, setDecisionType] = useState<DecisionType>("hiring");
  const [caseMode, setCaseMode] = useState<CaseMode>("expected");
  const [scenarioName, setScenarioName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  const [hiresCount, setHiresCount] = useState(2);
  const [salaryPerHire, setSalaryPerHire] = useState(135000);
  const [burdenRate, setBurdenRate] = useState(15);
  const [productivityLagMonths, setProductivityLagMonths] = useState(3);

  const [currentPrice, setCurrentPrice] = useState(250);
  const [targetPrice, setTargetPrice] = useState(325);
  const [currentVolume, setCurrentVolume] = useState(200);
  const [elasticityChurnPct, setElasticityChurnPct] = useState(8);

  const [adSpendIncrement, setAdSpendIncrement] = useState(6500);
  const [blendedCac, setBlendedCac] = useState(240);
  const [customerLtv, setCustomerLtv] = useState(1500);

  const [oneTimeCapex, setOneTimeCapex] = useState(25000);
  const [recurringOpexIncrement, setRecurringOpexIncrement] = useState(4500);
  const [efficiencySavingsPct, setEfficiencySavingsPct] = useState(6);

  const [productDevCost, setProductDevCost] = useState(35000);
  const [monthlyUnitsForecast, setMonthlyUnitsForecast] = useState(75);
  const [productUnitMargin, setProductUnitMargin] = useState(180);

  const multipliers = useMemo(() => {
    if (caseMode === "best") {
      return { revMult: 1.25, expMult: 0.9, churnMult: 0.5 };
    }
    if (caseMode === "worst") {
      return { revMult: 0.75, expMult: 1.2, churnMult: 1.6 };
    }
    return { revMult: 1.0, expMult: 1.0, churnMult: 1.0 };
  }, [caseMode]);

  const baseMonthlyRev = summary?.totalRevenue > 0 ? summary.totalRevenue / 3 : 25000;
  const baseMonthlyExp = summary?.totalExpenses > 0 ? summary.totalExpenses / 3 : 15000;
  const baseMonthlyNet = baseMonthlyRev - baseMonthlyExp;

  const evaluated = useMemo(() => {
    let addMonthlyRev = 0;
    let addMonthlyExp = 0;
    let initialCapex = 0;
    let breakEvenMetric = "";
    let paybackMonths = 0;

    if (decisionType === "hiring") {
      const monthlyPerHead = (salaryPerHire * (1 + burdenRate / 100)) / 12;
      addMonthlyExp = hiresCount * monthlyPerHead * multipliers.expMult;
      addMonthlyRev = hiresCount * (monthlyPerHead * 1.35) * multipliers.revMult;
      breakEvenMetric = `${formatCur(addMonthlyExp)}/mo added revenue needed to cover overhead`;
      paybackMonths = addMonthlyRev > addMonthlyExp ? Math.ceil(productivityLagMonths * 1.8) : 0;
    } else if (decisionType === "pricing") {
      const churnRate = (elasticityChurnPct * multipliers.churnMult) / 100;
      const expectedUnits = Math.round(currentVolume * (1 - churnRate));
      const baselineGross = currentPrice * currentVolume;
      const newGross = (targetPrice * expectedUnits) * multipliers.revMult;
      addMonthlyRev = newGross - baselineGross;
      addMonthlyExp = 0;
      breakEvenMetric = `Requires retaining at least ${Math.ceil(baselineGross / targetPrice)} active paying accounts`;
      paybackMonths = 0;
    } else if (decisionType === "ads") {
      addMonthlyExp = adSpendIncrement * multipliers.expMult;
      const adjustedCac = blendedCac * (caseMode === "worst" ? 1.3 : caseMode === "best" ? 0.8 : 1.0);
      const acquiredAccounts = Math.floor(addMonthlyExp / (adjustedCac || 1));
      addMonthlyRev = (acquiredAccounts * (customerLtv / 12)) * multipliers.revMult;
      breakEvenMetric = `Requires acquiring ${Math.ceil(addMonthlyExp / (customerLtv / 12 || 1))} customers/mo at $${adjustedCac.toFixed(0)} CAC`;
      paybackMonths = addMonthlyRev > 0 ? Math.ceil((addMonthlyExp * 3) / addMonthlyRev) : 0;
    } else if (decisionType === "expansion") {
      initialCapex = oneTimeCapex * multipliers.expMult;
      const savings = (baseMonthlyExp * (efficiencySavingsPct / 100)) * multipliers.revMult;
      addMonthlyExp = (recurringOpexIncrement * multipliers.expMult) - savings;
      addMonthlyRev = savings * 1.2;
      breakEvenMetric = `${formatCur(initialCapex)} initial draw requires ${formatCur(addMonthlyExp + initialCapex / 12)}/mo efficiency capture`;
      paybackMonths = savings > 0 ? Math.ceil(initialCapex / (savings + 1)) : 24;
    } else if (decisionType === "product") {
      initialCapex = productDevCost * multipliers.expMult;
      addMonthlyRev = monthlyUnitsForecast * productUnitMargin * multipliers.revMult;
      addMonthlyExp = productDevCost * 0.08 * multipliers.expMult;
      breakEvenMetric = `Break-even volume: ${Math.ceil(addMonthlyExp / (productUnitMargin || 1))} units/mo`;
      paybackMonths = addMonthlyRev > addMonthlyExp ? Math.ceil(initialCapex / (addMonthlyRev - addMonthlyExp)) : 0;
    }

    const hypotheticalMonthlyRev = baseMonthlyRev + addMonthlyRev;
    const hypotheticalMonthlyExp = baseMonthlyExp + addMonthlyExp;
    const hypotheticalMonthlyNet = hypotheticalMonthlyRev - hypotheticalMonthlyExp;
    const netMonthlyDelta = hypotheticalMonthlyNet - baseMonthlyNet;

    const curve = [];
    let baseCash = summary?.cashPosition || 600000;
    let hypoCash = (summary?.cashPosition || 600000) - initialCapex;

    const monthLabels = ["Now", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];
    for (let m = 0; m <= 12; m++) {
      if (m > 0) {
        baseCash += baseMonthlyNet;
        hypoCash += hypotheticalMonthlyNet;
      }
      curve.push({
        month: monthLabels[m],
        Baseline: Math.round(baseCash),
        Hypothetical: Math.round(hypoCash),
      });
    }

    const hypotheticalRunway = hypotheticalMonthlyExp > 0
      ? parseFloat((((summary?.cashPosition || 600000) - initialCapex) / hypotheticalMonthlyExp).toFixed(1))
      : 36;
    const runwayDelta = parseFloat((hypotheticalRunway - (summary?.runwayMonths || 20)).toFixed(1));

    return {
      addMonthlyRev,
      addMonthlyExp,
      initialCapex,
      netMonthlyDelta,
      hypotheticalMonthlyRev,
      hypotheticalMonthlyExp,
      hypotheticalMonthlyNet,
      hypotheticalRunway,
      runwayDelta,
      breakEvenMetric,
      paybackMonths,
      curve,
    };
  }, [
    decisionType,
    caseMode,
    multipliers,
    hiresCount,
    salaryPerHire,
    burdenRate,
    productivityLagMonths,
    currentPrice,
    targetPrice,
    currentVolume,
    elasticityChurnPct,
    adSpendIncrement,
    blendedCac,
    customerLtv,
    oneTimeCapex,
    recurringOpexIncrement,
    efficiencySavingsPct,
    productDevCost,
    monthlyUnitsForecast,
    productUnitMargin,
    baseMonthlyRev,
    baseMonthlyExp,
    baseMonthlyNet,
    summary,
  ]);

  const handleSaveScenario = async () => {
    if (!scenarioName.trim()) return;
    await saveScenario(
      scenarioName.trim(),
      decisionType.toUpperCase(),
      { caseMode, decisionType },
      {
        monthlyRevDelta: evaluated.addMonthlyRev,
        monthlyExpDelta: evaluated.addMonthlyExp,
        netDelta: evaluated.netMonthlyDelta,
        runwayDelta: evaluated.runwayDelta,
        breakEvenMetric: evaluated.breakEvenMetric,
        paybackMonths: evaluated.paybackMonths,
      }
    );
    setScenarioName("");
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="space-y-10 pb-16 selection:bg-white selection:text-black">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Institutional Capital Modeling • Executive War Room
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            MARGIN Decision Room
          </h1>
        </div>

        <div className="flex border border-[#222222] bg-[#0A0A0A] p-1 self-start sm:self-auto">
          {(["best", "expected", "worst"] as const).map((mode) => (
            <button
              key={mode}
              onClick={() => setCaseMode(mode)}
              className={`px-3.5 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer ${
                caseMode === mode
                  ? mode === "worst"
                    ? "bg-red-950/80 border border-red-700 text-red-200 font-medium"
                    : mode === "best"
                    ? "bg-[#0F1E12] border border-emerald-700 text-emerald-300 font-medium"
                    : "bg-white text-black font-medium"
                  : "text-[#707070] hover:text-white"
              }`}
            >
              {mode === "best" ? "Best Case (+25%)" : mode === "worst" ? "Worst Case (-25%)" : "Expected Case"}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
        {[
          { type: "hiring" as DecisionType, title: "Talent Acquisition", icon: Users },
          { type: "pricing" as DecisionType, title: "Price Elasticity", icon: Tag },
          { type: "ads" as DecisionType, title: "Marketing & CAC", icon: Megaphone },
          { type: "expansion" as DecisionType, title: "Operational Capex", icon: Building },
          { type: "product" as DecisionType, title: "Product Launch", icon: Package },
        ].map((item) => {
          const Icon = item.icon;
          const isSelected = decisionType === item.type;
          return (
            <button
              key={item.type}
              onClick={() => setDecisionType(item.type)}
              className={`p-3.5 border transition-all text-left flex items-center space-x-2.5 cursor-pointer apple-press ${
                isSelected
                  ? "border-white bg-[#121212] text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)]"
                  : "border-[#222222] bg-[#0A0A0A] text-[#707070] hover:border-[#404040] hover:text-white"
              }`}
            >
              <Icon size={14} className={isSelected ? "text-white" : "text-[#707070]"} />
              <span className="text-[11px] uppercase tracking-wider truncate font-sans">
                {item.title}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-5 border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          <div className="pb-4 border-b border-[#222222] flex justify-between items-center">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">
              Decision Assumptions
            </span>
            <span className="text-[9px] uppercase tracking-widest border border-[#222222] px-2 py-0.5 text-white font-mono">
              Mode: {caseMode.toUpperCase()}
            </span>
          </div>

          {decisionType === "hiring" && (
            <div className="space-y-5">
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#A0A0A0] uppercase tracking-wider text-[10px]">Headcount Expansion</span>
                  <span className="font-mono text-white text-sm">+{hiresCount} Staff</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="12"
                  value={hiresCount}
                  onChange={(e) => setHiresCount(parseInt(e.target.value))}
                  className="w-full accent-white cursor-pointer bg-[#222] h-1"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">
                  Average Annual Salary (USD)
                </label>
                <input
                  type="number"
                  step="5000"
                  value={salaryPerHire}
                  onChange={(e) => setSalaryPerHire(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">
                    Taxes & Overhead (%)
                  </label>
                  <input
                    type="number"
                    value={burdenRate}
                    onChange={(e) => setBurdenRate(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-white"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">
                    Ramp Lag (Mo)
                  </label>
                  <input
                    type="number"
                    value={productivityLagMonths}
                    onChange={(e) => setProductivityLagMonths(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs focus:outline-none focus:border-white"
                  />
                </div>
              </div>
            </div>
          )}

          {decisionType === "pricing" && (
            <div className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Current Price</label>
                  <input
                    type="number"
                    value={currentPrice}
                    onChange={(e) => setCurrentPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Proposed Price</label>
                  <input
                    type="number"
                    value={targetPrice}
                    onChange={(e) => setTargetPrice(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Paying Customer Base</label>
                <input
                  type="number"
                  value={currentVolume}
                  onChange={(e) => setCurrentVolume(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                />
              </div>
              <div>
                <div className="flex justify-between items-center text-xs mb-2">
                  <span className="text-[#A0A0A0] uppercase tracking-wider text-[10px]">Elasticity Churn Exposure</span>
                  <span className="font-mono text-red-400 text-sm">-{elasticityChurnPct}% units</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="35"
                  value={elasticityChurnPct}
                  onChange={(e) => setElasticityChurnPct(parseInt(e.target.value))}
                  className="w-full accent-white cursor-pointer bg-[#222] h-1"
                />
              </div>
            </div>
          )}

          {decisionType === "ads" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Monthly Ad Budget (USD)</label>
                <input
                  type="number"
                  step="500"
                  value={adSpendIncrement}
                  onChange={(e) => setAdSpendIncrement(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Target Blended CAC</label>
                  <input
                    type="number"
                    value={blendedCac}
                    onChange={(e) => setBlendedCac(parseInt(e.target.value) || 1)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Customer LTV</label>
                  <input
                    type="number"
                    value={customerLtv}
                    onChange={(e) => setCustomerLtv(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {decisionType === "expansion" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Upfront Capex</label>
                <input
                  type="number"
                  step="2500"
                  value={oneTimeCapex}
                  onChange={(e) => setOneTimeCapex(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Recurring OpEx</label>
                  <input
                    type="number"
                    value={recurringOpexIncrement}
                    onChange={(e) => setRecurringOpexIncrement(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Efficiency Gain (%)</label>
                  <input
                    type="number"
                    value={efficiencySavingsPct}
                    onChange={(e) => setEfficiencySavingsPct(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {decisionType === "product" && (
            <div className="space-y-5">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Inception R&D Cost</label>
                <input
                  type="number"
                  step="5000"
                  value={productDevCost}
                  onChange={(e) => setProductDevCost(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Monthly Units</label>
                  <input
                    type="number"
                    value={monthlyUnitsForecast}
                    onChange={(e) => setMonthlyUnitsForecast(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1.5">Unit Margin (USD)</label>
                  <input
                    type="number"
                    value={productUnitMargin}
                    onChange={(e) => setProductUnitMargin(parseInt(e.target.value) || 0)}
                    className="w-full bg-black border border-[#222222] px-3.5 py-2 text-white font-mono text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          <div className="pt-4 border-t border-[#1c1c1c] space-y-2">
            <div className="flex items-center space-x-1.5 text-xs text-white uppercase tracking-wider font-medium">
              <AlertTriangle size={13} className="text-emerald-400" />
              <span>Break-Even Requirement</span>
            </div>
            <p className="text-xs font-mono text-[#A0A0A0] leading-relaxed bg-black p-3 border border-[#1c1c1c]">
              {evaluated.breakEvenMetric}
            </p>
          </div>

          <div className="pt-4 border-t border-[#1c1c1c] space-y-3">
            <label className="block text-[10px] uppercase tracking-widest text-[#707070]">
              Save Scenario to Database
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="e.g. Q1 Headcount Surge..."
                value={scenarioName}
                onChange={(e) => setScenarioName(e.target.value)}
                className="flex-1 bg-black border border-[#222222] px-3 py-1.5 text-xs text-white placeholder-[#404040] focus:outline-none focus:border-white"
              />
              <Button variant="primary" size="sm" onClick={handleSaveScenario}>
                <BookmarkPlus size={12} className="mr-1.5" /> Save
              </Button>
            </div>
            {saveSuccess && (
              <span className="text-[10px] text-emerald-400 font-mono block">
                ✓ Decision scenario permanently committed to Supabase ledger.
              </span>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 space-y-8">
          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
            <div className="pb-4 mb-6 border-b border-[#222222] flex justify-between items-center">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">
                  Comparative Matrix
                </span>
                <h3 className="font-serif text-2xl text-white font-light mt-1">
                  Baseline vs Hypothetical Outcome
                </h3>
              </div>
              <span className="text-xs font-mono uppercase text-emerald-400">
                Modeled Delta: {evaluated.netMonthlyDelta >= 0 ? "+" : ""}{formatCur(evaluated.netMonthlyDelta)}/mo
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4 pb-6 border-b border-[#1c1c1c] text-center">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Current Baseline</span>
                <span className="font-mono text-sm text-[#A0A0A0] block">Rev: {formatCur(baseMonthlyRev)}/mo</span>
                <span className="font-mono text-sm text-[#A0A0A0] block">Exp: {formatCur(baseMonthlyExp)}/mo</span>
                <span className="font-mono text-sm text-white font-medium block mt-1">Net: {formatCur(baseMonthlyNet)}/mo</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-white block mb-1">Hypothetical Case</span>
                <span className="font-mono text-sm text-white block">Rev: {formatCur(evaluated.hypotheticalMonthlyRev)}/mo</span>
                <span className="font-mono text-sm text-white block">Exp: {formatCur(evaluated.hypotheticalMonthlyExp)}/mo</span>
                <span className="font-mono text-sm text-emerald-400 font-medium block mt-1">Net: {formatCur(evaluated.hypotheticalMonthlyNet)}/mo</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Variance Delta (Δ)</span>
                <span className={`font-mono text-sm block ${evaluated.addMonthlyRev >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {evaluated.addMonthlyRev >= 0 ? "+" : ""}{formatCur(evaluated.addMonthlyRev)}
                </span>
                <span className="font-mono text-sm text-[#707070] block">+{formatCur(evaluated.addMonthlyExp)}</span>
                <span className={`font-mono text-sm font-medium block mt-1 ${evaluated.netMonthlyDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {evaluated.netMonthlyDelta >= 0 ? "+" : ""}{formatCur(evaluated.netMonthlyDelta)}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 pt-6 text-xs">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Projected Runway</span>
                <div className="font-serif text-2xl text-white font-light">{evaluated.hypotheticalRunway} Mo</div>
                <span className={`text-[10px] font-mono mt-0.5 block ${evaluated.runwayDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {evaluated.runwayDelta >= 0 ? "+" : ""}{evaluated.runwayDelta} Mo Shift
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Initial Capital Draw</span>
                <div className="font-serif text-2xl text-white font-light">{formatCur(evaluated.initialCapex)}</div>
                <span className="text-[10px] font-mono text-[#707070] mt-0.5 block">Upfront commitment</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-widest text-[#707070] block mb-1">Payback Horizon</span>
                <div className="font-serif text-2xl text-emerald-400 font-light">
                  {evaluated.paybackMonths > 0 ? `${evaluated.paybackMonths} Mo` : "Immediate Accretive"}
                </div>
                <span className="text-[10px] font-mono text-[#707070] mt-0.5 block">Capital amortization</span>
              </div>
            </div>
          </div>

          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
            <div className="pb-4 mb-6 border-b border-[#222222] flex justify-between items-center">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Comparative Trajectory</span>
                <h3 className="font-serif text-2xl text-white font-light mt-1">Cash Reserve Variance Over 12 Months</h3>
              </div>
            </div>

            {mounted && (
              <div className="h-72 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={evaluated.curve} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="hypoGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#4E8752" stopOpacity={0.25} />
                        <stop offset="95%" stopColor="#4E8752" stopOpacity={0.0} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid stroke="#1c1c1c" vertical={false} strokeDasharray="2 2" />
                    <XAxis dataKey="month" stroke="#525252" tickLine={false} style={{ fontSize: "11px" }} />
                    <YAxis
                      stroke="#525252"
                      tickLine={false}
                      tickFormatter={(v) => `$${v / 1000}k`}
                      style={{ fontSize: "11px" }}
                    />
                    <Tooltip
                      contentStyle={{ backgroundColor: "#0A0A0A", borderColor: "#333", fontSize: "12px", color: "#fff" }}
                      formatter={(val: any) => [`$${val?.toLocaleString()}`, ""]}
                    />
                    <Area type="monotone" dataKey="Baseline" stroke="#707070" strokeWidth={1.5} strokeDasharray="4 4" fillOpacity={0} />
                    <Area type="monotone" dataKey="Hypothetical" stroke="#FFFFFF" strokeWidth={2} fill="url(#hypoGrad)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex items-center space-x-6 pt-4 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-neutral-500 inline-block border-b border-dashed" />
                <span>Baseline Reserve Trajectory</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-white inline-block" />
                <span>Post-Decision Projected Curve</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
        <div className="pb-4 mb-6 border-b border-[#222222] flex justify-between items-center">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">Persistent Decision Ledger</span>
            <h3 className="font-serif text-2xl text-white font-light mt-1">Saved Scenarios & Board Deliberations</h3>
          </div>
          <span className="text-xs text-[#707070] font-mono">{scenarios.length} Scenarios Archived</span>
        </div>

        {scenarios.length === 0 ? (
          <div className="text-center py-10 text-xs text-[#707070]">
            No decision scenarios saved yet. Use the assumption panel above to evaluate and archive business decisions.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {scenarios.map((scn) => (
              <div key={scn.id} className="border border-[#1c1c1c] bg-black p-5 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex justify-between items-center pb-2 border-b border-[#1c1c1c]">
                    <span className="text-[9px] uppercase tracking-widest text-[#707070]">{scn.decisionType}</span>
                    <button
                      onClick={() => deleteScenario(scn.id)}
                      className="text-[#505050] hover:text-red-400 transition-colors p-1 cursor-pointer"
                      title="Delete saved scenario"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                  <h4 className="font-serif text-lg text-white font-light mt-2 mb-2 truncate">{scn.name}</h4>
                  <div className="space-y-1.5 text-[11px] font-mono text-[#A0A0A0]">
                    <div className="flex justify-between">
                      <span>Net Impact:</span>
                      <span className={scn.outcomes?.netDelta >= 0 ? "text-emerald-400" : "text-red-400"}>
                        {scn.outcomes?.netDelta >= 0 ? "+" : ""}{formatCur(scn.outcomes?.netDelta || 0)}/mo
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Runway Shift:</span>
                      <span className="text-white">
                        {scn.outcomes?.runwayDelta >= 0 ? "+" : ""}{scn.outcomes?.runwayDelta || 0} Mo
                      </span>
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-[#1c1c1c] text-[10px] text-[#505050] flex justify-between items-center">
                  <span>{new Date(scn.createdAt).toLocaleDateString()}</span>
                  <span className="text-emerald-400">Archived</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
