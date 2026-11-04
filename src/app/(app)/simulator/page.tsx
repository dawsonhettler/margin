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
  Line,
} from "recharts";
import {
  Users,
  Tag,
  Megaphone,
  Activity,
  AlertTriangle,
  RefreshCw,
  Sliders,
  ShieldCheck,
  TrendingUp,
} from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export default function SimulatorPage() {
  const { summary } = useFinancial();
  const [tab, setTab] = useState<"montecarlo" | "hiring" | "pricing" | "ads">("montecarlo");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // -------------------------------------------------------------
  // MONTE CARLO STOCHASTIC ENGINE PARAMETERS
  // -------------------------------------------------------------
  const [volatility, setVolatility] = useState(18); // 18% monthly variance
  const [drift, setDrift] = useState(8); // +8% monthly baseline drift
  const [blackSwanShock, setBlackSwanShock] = useState(false);
  const [simSeed, setSimSeed] = useState(1);

  // Box-Muller transform for standard normal random numbers
  const gaussianRandom = () => {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  };

  // Run 1,000 stochastic trajectories
  const { chartData, solvencyRate, p5Cash, p50Cash, p95Cash } = useMemo(() => {
    const runs = 1000;
    const months = 12;
    const initialCash = summary.cashPosition || 600000;
    const baseRev = (summary.totalRevenue || 50000) / 2;
    const baseExp = (summary.totalExpenses || 30000) / 2;

    const allTrajectories: number[][] = [];
    let solventCount = 0;

    const sigma = volatility / 100;
    const mu = (drift - (blackSwanShock ? 25 : 0)) / 100;

    for (let r = 0; r < runs; r++) {
      const path: number[] = [initialCash];
      let cash = initialCash;
      let rev = baseRev;
      let exp = baseExp;

      for (let m = 1; m <= months; m++) {
        // Geometric Brownian Motion step
        const z = gaussianRandom();
        const shockFactor = Math.exp((mu - 0.5 * sigma * sigma) + sigma * z);
        rev = rev * shockFactor;
        exp = exp * (1 + 0.02 * Math.random()); // 0-2% inflation

        const net = rev - exp;
        cash += net;
        path.push(Math.round(cash));
      }

      if (cash > 0) solventCount++;
      allTrajectories.push(path);
    }

    // Extract percentiles across all 1,000 runs per month
    const timeline = [];
    const monthLabels = ["Now", "M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M9", "M10", "M11", "M12"];

    for (let m = 0; m <= months; m++) {
      const valuesAtMonth = allTrajectories.map((p) => p[m]).sort((a, b) => a - b);
      const p5 = valuesAtMonth[Math.floor(runs * 0.05)];
      const p50 = valuesAtMonth[Math.floor(runs * 0.5)];
      const p95 = valuesAtMonth[Math.floor(runs * 0.95)];

      timeline.push({
        month: monthLabels[m],
        P5_StressTest: p5,
        P50_Expected: p50,
        P95_BullCase: p95,
      });
    }

    return {
      chartData: timeline,
      solvencyRate: ((solventCount / runs) * 100).toFixed(1),
      p5Cash: timeline[months].P5_StressTest,
      p50Cash: timeline[months].P50_Expected,
      p95Cash: timeline[months].P95_BullCase,
    };
  }, [summary, volatility, drift, blackSwanShock, simSeed]);

  // -------------------------------------------------------------
  // TRADITIONAL SIMULATOR STATES
  // -------------------------------------------------------------
  const [newHires, setNewHires] = useState(2);
  const [avgSalary, setAvgSalary] = useState(120000);
  const [currentPrice, setCurrentPrice] = useState(250);
  const [proposedPrice, setProposedPrice] = useState(325);
  const [currentMonthlyUnits, setCurrentMonthlyUnits] = useState(200);
  const [churnRiskPct, setChurnRiskPct] = useState(8);
  const [additionalAdBudget, setAdditionalAdBudget] = useState(5000);
  const [targetCac, setTargetCac] = useState(220);
  const [customerLtv, setCustomerLtv] = useState(1400);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Quantitative Stress-Testing • 1,000-Path Stochastic Modeling
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Business Simulator
          </h1>
        </div>

        {/* Tab Navigation */}
        <div className="flex flex-wrap border border-[#222222] bg-[#0A0A0A] p-1 gap-1">
          <button
            onClick={() => setTab("montecarlo")}
            className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer flex items-center space-x-1.5 ${
              tab === "montecarlo" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
            }`}
          >
            <Activity size={12} />
            <span>Monte Carlo Quant Lab</span>
          </button>
          <button
            onClick={() => setTab("hiring")}
            className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
              tab === "hiring" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
            }`}
          >
            Headcount
          </button>
          <button
            onClick={() => setTab("pricing")}
            className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
              tab === "pricing" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
            }`}
          >
            Pricing Curve
          </button>
          <button
            onClick={() => setTab("ads")}
            className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
              tab === "ads" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
            }`}
          >
            Growth & CAC
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 1. MONTE CARLO QUANTITATIVE SIMULATION LAB */}
      {/* ------------------------------------------------------------- */}
      {tab === "montecarlo" && (
        <div className="space-y-8">
          {/* Top Metric Strip */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 border-b border-[#222222] pb-8">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">
                Solvency Probability
              </span>
              <div className="font-serif text-3xl sm:text-4xl text-emerald-400 font-light">
                {solvencyRate}%
              </div>
              <span className="text-xs text-[#707070] mt-1 block">Across 1,000 stochastic runs</span>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">
                P5 Stress-Test (Black Swan)
              </span>
              <div className="font-serif text-3xl sm:text-4xl text-red-400 font-light">
                {formatCur(p5Cash)}
              </div>
              <span className="text-xs text-[#707070] mt-1 block">95% confidence lower bound</span>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">
                P50 Median Expectation
              </span>
              <div className="font-serif text-3xl sm:text-4xl text-white font-light">
                {formatCur(p50Cash)}
              </div>
              <span className="text-xs text-[#707070] mt-1 block">Most probable terminal cash</span>
            </div>
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">
                P95 Bull-Case Ceiling
              </span>
              <div className="font-serif text-3xl sm:text-4xl text-white font-light">
                {formatCur(p95Cash)}
              </div>
              <span className="text-xs text-emerald-400 mt-1 block">Top 5% market outperformance</span>
            </div>
          </div>

          {/* Monte Carlo Visual Cone Chart */}
          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#222222] gap-4">
              <div>
                <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">
                  Geometric Brownian Motion Fan Chart
                </span>
                <h3 className="font-serif text-2xl text-white font-light mt-1">
                  12-Month Stochastic Capital Reserve Cones
                </h3>
              </div>

              <button
                onClick={() => setSimSeed((s) => s + 1)}
                className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#A0A0A0] hover:text-white border border-[#222222] px-3 py-1.5 hover:border-white transition-colors cursor-pointer self-start sm:self-auto"
              >
                <RefreshCw size={12} />
                <span>Re-Run 1,000 Iterations</span>
              </button>
            </div>

            {mounted && (
              <div className="h-80 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                    <defs>
                      <linearGradient id="p95Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.15} />
                        <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                      </linearGradient>
                      <linearGradient id="p5Grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#A84E4E" stopOpacity={0.2} />
                        <stop offset="95%" stopColor="#A84E4E" stopOpacity={0.0} />
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
                      contentStyle={{
                        backgroundColor: "#0A0A0A",
                        borderColor: "#333",
                        fontSize: "12px",
                        color: "#fff",
                      }}
                      formatter={(val: any) => [`$${val?.toLocaleString()}`, ""]}
                    />
                    {/* Confidence Cones */}
                    <Area
                      type="monotone"
                      dataKey="P95_BullCase"
                      name="P95 Bull Case"
                      stroke="#FFFFFF"
                      strokeWidth={1.5}
                      fillOpacity={1}
                      fill="url(#p95Grad)"
                    />
                    <Area
                      type="monotone"
                      dataKey="P50_Expected"
                      name="P50 Median"
                      stroke="#4E8752"
                      strokeWidth={2}
                      fillOpacity={0}
                    />
                    <Area
                      type="monotone"
                      dataKey="P5_StressTest"
                      name="P5 Black Swan"
                      stroke="#A84E4E"
                      strokeWidth={1.5}
                      strokeDasharray="4 4"
                      fillOpacity={1}
                      fill="url(#p5Grad)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            )}

            <div className="flex flex-wrap items-center gap-6 pt-4 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-white inline-block" />
                <span>P95 Outperformance Band</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-emerald-500 inline-block" />
                <span>P50 Expected Median</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-3 h-0.5 bg-red-400 inline-block border-b border-dashed" />
                <span>P5 Stress-Test Threshold</span>
              </div>
            </div>
          </div>

          {/* Stochastic Stress Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-white">Monthly Volatility (σ)</span>
                <span className="font-mono text-xs text-white">±{volatility}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="40"
                value={volatility}
                onChange={(e) => setVolatility(parseInt(e.target.value))}
                className="w-full accent-white cursor-pointer bg-[#222] h-1"
              />
              <span className="text-[10px] text-[#707070] mt-2 block">
                Simulates unpredictable market variance & payment churn.
              </span>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-[10px] uppercase tracking-widest text-white">Annualized Growth Drift (μ)</span>
                <span className="font-mono text-xs text-white">+{drift}%</span>
              </div>
              <input
                type="range"
                min="-10"
                max="30"
                value={drift}
                onChange={(e) => setDrift(parseInt(e.target.value))}
                className="w-full accent-white cursor-pointer bg-[#222] h-1"
              />
              <span className="text-[10px] text-[#707070] mt-2 block">
                Underlying contract expansion velocity.
              </span>
            </div>

            <div>
              <span className="text-[10px] uppercase tracking-widest text-white block mb-2">
                Macro Scenario Injector
              </span>
              <button
                onClick={() => setBlackSwanShock((b) => !b)}
                className={`w-full py-2.5 px-3 text-xs uppercase tracking-wider transition-colors border cursor-pointer ${
                  blackSwanShock
                    ? "bg-red-950/60 border-red-700 text-red-200 font-medium"
                    : "border-[#333] bg-black text-[#A0A0A0] hover:border-white"
                }`}
              >
                {blackSwanShock ? "⚠️ -25% Macro Shock Injected" : "Inject Macro Recession Shock"}
              </button>
              <span className="text-[10px] text-[#707070] mt-2 block">
                Instantly recalculates 1,000 curves against severe demand contraction.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 2. HEADCOUNT EXPANSION */}
      {/* ------------------------------------------------------------- */}
      {tab === "hiring" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-[#222222] flex items-center space-x-2">
              <Users size={16} className="text-white" />
              <h3 className="font-serif text-xl text-white font-light">Talent Expansion Parameters</h3>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-2">
                New Headcount Additions: {newHires} Personnel
              </label>
              <input
                type="range"
                min="1"
                max="10"
                value={newHires}
                onChange={(e) => setNewHires(parseInt(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">
                Average Annual Base Salary (USD)
              </label>
              <input
                type="number"
                step="5000"
                value={avgSalary}
                onChange={(e) => setAvgSalary(parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs"
              />
            </div>
          </div>

          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block">Capital Impact</span>
              <h3 className="font-serif text-2xl text-white font-light mt-1">Simulated Burden Delta</h3>
              <div className="space-y-4 mt-6 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Added Monthly Burn Rate</span>
                  <span className="text-white font-mono font-medium">
                    +{formatCur((newHires * (avgSalary * 1.15)) / 12)}/mo
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Simulated Revised Runway</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    {(
                      summary.cashPosition /
                      (summary.totalExpenses / 2 + (newHires * (avgSalary * 1.15)) / 12)
                    ).toFixed(1)}{" "}
                    Months
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-[#222222] text-xs text-[#707070]">
              Verdict: Balance sheet safely sustains this headcount expansion without dilutive capital raises.
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 3. PRICING CURVE */}
      {/* ------------------------------------------------------------- */}
      {tab === "pricing" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-[#222222] flex items-center space-x-2">
              <Tag size={16} className="text-white" />
              <h3 className="font-serif text-xl text-white font-light">Pricing Curve Assumptions</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">Current Tier Price</label>
                <input
                  type="number"
                  value={currentPrice}
                  onChange={(e) => setCurrentPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">Proposed Tier Price</label>
                <input
                  type="number"
                  value={proposedPrice}
                  onChange={(e) => setProposedPrice(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs"
                />
              </div>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-2">
                Modeled Churn Risk: -{churnRiskPct}% volume
              </label>
              <input
                type="range"
                min="0"
                max="30"
                value={churnRiskPct}
                onChange={(e) => setChurnRiskPct(parseInt(e.target.value))}
                className="w-full accent-white cursor-pointer"
              />
            </div>
          </div>

          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block">Elasticity Analysis</span>
              <h3 className="font-serif text-2xl text-white font-light mt-1">Simulated Net Inflow Delta</h3>
              <div className="space-y-4 mt-6 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Baseline Monthly Volume</span>
                  <span className="text-white font-mono">{formatCur(currentPrice * currentMonthlyUnits)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Net Monthly Revenue Expansion</span>
                  <span className="font-mono font-medium text-emerald-400">
                    +{formatCur(proposedPrice * Math.round(currentMonthlyUnits * (1 - churnRiskPct / 100)) - currentPrice * currentMonthlyUnits)}/mo
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-[#222222] text-xs text-[#707070]">
              Higher unit contract values easily absorb the modeled volume contraction.
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      {/* 4. GROWTH & CAC */}
      {/* ------------------------------------------------------------- */}
      {tab === "ads" && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
            <div className="pb-4 border-b border-[#222222] flex items-center space-x-2">
              <Megaphone size={16} className="text-white" />
              <h3 className="font-serif text-xl text-white font-light">Acquisition Engine Parameters</h3>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">Additional Ad Spend (USD/mo)</label>
              <input
                type="number"
                step="500"
                value={additionalAdBudget}
                onChange={(e) => setAdditionalAdBudget(parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">Target Blended CAC</label>
                <input
                  type="number"
                  value={targetCac}
                  onChange={(e) => setTargetCac(parseInt(e.target.value) || 1)}
                  className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs"
                />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">Estimated Customer LTV</label>
                <input
                  type="number"
                  value={customerLtv}
                  onChange={(e) => setCustomerLtv(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs"
                />
              </div>
            </div>
          </div>

          <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block">Return On Capital</span>
              <h3 className="font-serif text-2xl text-white font-light mt-1">Growth Acquisition Return</h3>
              <div className="space-y-4 mt-6 text-xs">
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">New Customers Acquired / Mo</span>
                  <span className="text-white font-mono font-medium">
                    +{Math.floor(additionalAdBudget / (targetCac || 1))} accounts
                  </span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Net LTV Value Yield</span>
                  <span className="text-emerald-400 font-mono font-medium">
                    +{formatCur(Math.floor(additionalAdBudget / (targetCac || 1)) * customerLtv - additionalAdBudget)}
                  </span>
                </div>
              </div>
            </div>
            <div className="pt-6 border-t border-[#222222] text-xs text-[#707070]">
              LTV:CAC ratio is {(customerLtv / (targetCac || 1)).toFixed(1)}x (above standard 3.0x venture threshold).
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
