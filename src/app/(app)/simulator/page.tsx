"use client";
import React, { useState } from "react";
import { Users, Tag, Megaphone, ArrowRight } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export default function SimulatorPage() {
  const { summary } = useFinancial();
  const [tab, setTab] = useState<"hiring" | "pricing" | "ads">("hiring");

  // Headcount Simulator State
  const [newHires, setNewHires] = useState(2);
  const [avgSalary, setAvgSalary] = useState(120000); // $120k / yr
  const [taxBenefitsPct, setTaxBenefitsPct] = useState(15); // +15%

  // Pricing Simulator State
  const [currentPrice, setCurrentPrice] = useState(250);
  const [proposedPrice, setProposedPrice] = useState(325);
  const [currentMonthlyUnits, setCurrentMonthlyUnits] = useState(200);
  const [churnRiskPct, setChurnRiskPct] = useState(8); // -8% volume drop

  // Advertising Simulator State
  const [additionalAdBudget, setAdditionalAdBudget] = useState(5000);
  const [targetCac, setTargetCac] = useState(220);
  const [customerLtv, setCustomerLtv] = useState(1400);

  const formatCur = (v: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 0 }).format(v);

  // Calculations
  const monthlySalaryPerHire = (avgSalary * (1 + taxBenefitsPct / 100)) / 12;
  const totalAddedMonthlyBurn = newHires * monthlySalaryPerHire;
  const newBreakEvenRevenueReq = summary.totalExpenses + totalAddedMonthlyBurn * 3;

  // Pricing calculations
  const baselineRev = currentPrice * currentMonthlyUnits;
  const simulatedUnits = Math.round(currentMonthlyUnits * (1 - churnRiskPct / 100));
  const simulatedRev = proposedPrice * simulatedUnits;
  const priceDelta = simulatedRev - baselineRev;

  // Ad calculations
  const newCustomersAcquired = Math.floor(additionalAdBudget / (targetCac || 1));
  const newLtvGenerated = newCustomersAcquired * customerLtv;
  const netAdRoi = newLtvGenerated - additionalAdBudget;

  return (
    <div className="space-y-10 pb-16">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <div>
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
            Hypothetical Modeling • Zero Balance Sheet Risk
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
            Business Simulator
          </h1>
        </div>

        <div className="flex border border-[#222222] bg-[#0A0A0A] p-1">
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
            Pricing Elasticity
          </button>
          <button
            onClick={() => setTab("ads")}
            className={`px-4 py-1.5 text-[10px] tracking-[0.2em] uppercase transition-colors cursor-pointer ${
              tab === "ads" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
            }`}
          >
            Growth & Ads
          </button>
        </div>
      </div>

      {/* Simulator Workspace */}
      {tab === "hiring" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
              <div className="pb-4 border-b border-[#222222] flex items-center space-x-2">
                <Users size={16} className="text-white" />
                <h3 className="font-serif text-xl text-white font-light">Talent Expansion Parameters</h3>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-2">
                  New Headcount Additions: {newHires} Engineers/Staff
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
                  className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">
                  Tax, Benefits & Overhead Burden %
                </label>
                <input
                  type="number"
                  value={taxBenefitsPct}
                  onChange={(e) => setTaxBenefitsPct(parseInt(e.target.value) || 0)}
                  className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
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
                    <span className="text-white font-mono font-medium">+{formatCur(totalAddedMonthlyBurn)}/mo</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                    <span className="text-[#A0A0A0]">Added Annualized Capital Load</span>
                    <span className="text-white font-mono font-medium">+{formatCur(totalAddedMonthlyBurn * 12)}/yr</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                    <span className="text-[#A0A0A0]">Simulated Revised Runway</span>
                    <span className="text-emerald-400 font-mono font-medium">
                      {(summary.cashPosition / ((summary.totalExpenses / 3) + totalAddedMonthlyBurn)).toFixed(1)} Months
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-[#222222] text-xs text-[#707070]">
                Verdict: Current cash position safely absorbs this expansion without requiring an external equity round.
              </div>
            </div>
          </div>
        </div>
      )}

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
              <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-1">Current Paying Units / Month</label>
              <input
                type="number"
                value={currentMonthlyUnits}
                onChange={(e) => setCurrentMonthlyUnits(parseInt(e.target.value) || 0)}
                className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs"
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-[#707070] mb-2">
                Anticipated Price Churn: -{churnRiskPct}% volume
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
                  <span className="text-white font-mono">{formatCur(baselineRev)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Simulated Revised Volume</span>
                  <span className="text-white font-mono">{formatCur(simulatedRev)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Net Monthly Revenue Expansion</span>
                  <span className={`font-mono font-medium ${priceDelta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                    {priceDelta >= 0 ? "+" : ""}{formatCur(priceDelta)}/mo
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#222222] text-xs text-[#707070]">
              Higher unit pricing absorbs the modeled {churnRiskPct}% customer contraction, generating an additional {formatCur(priceDelta * 12)} in net annual cash.
            </div>
          </div>
        </div>
      )}

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
                  <span className="text-white font-mono font-medium">+{newCustomersAcquired} clients</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Pipeline LTV Generated</span>
                  <span className="text-white font-mono">{formatCur(newLtvGenerated)}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-[#1c1c1c]">
                  <span className="text-[#A0A0A0]">Net LTV Value Yield</span>
                  <span className="text-emerald-400 font-mono font-medium">+{formatCur(netAdRoi)}</span>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-[#222222] text-xs text-[#707070]">
              LTV:CAC ratio is {(customerLtv / (targetCac || 1)).toFixed(1)}x. A ratio above 3.0x indicates strong unit economics for deployment.
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
