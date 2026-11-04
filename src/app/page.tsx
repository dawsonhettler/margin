import React from "react";
import Link from "next/link";
import { ArrowUpRight, Cpu, SlidersHorizontal, Sparkles, Check, ShieldCheck, TrendingUp, BarChart3 } from "lucide-react";

export default function LandingPage() {
  const tiers = [
    {
      name: "Principal Seat",
      price: "$190",
      cadence: "per entity / month",
      desc: "For single-entity founders and bootstrapped ventures requiring balance sheet clarity and runway modeling.",
      features: [
        "Single Enterprise Ledger Sync",
        "Deterministic Runway & Cash Forecasting",
        "Deterministic P&L & Balance Sheet Engine",
        "Full General Ledger Audit History",
        "Standard Financial Report Exports",
      ],
      highlight: false,
    },
    {
      name: "Venture Partner",
      price: "$480",
      cadence: "per entity / month",
      desc: "For high-growth funded startups scaling headcount, marketing acquisition budgets, and forward capital burn.",
      features: [
        "Headcount & Talent Expansion Simulator",
        "Pricing Elasticity & Churn Modeler",
        "Advertising & Acquisition CAC Engine",
        "Gemini Executive AI Financial Copilot",
        "Multi-User Principal & CFO Seats",
        "Priority GAAP Statement Dossiers",
      ],
      highlight: true,
    },
    {
      name: "Sovereign Syndicate",
      price: "$1,200",
      cadence: "billed annually",
      desc: "For family offices, multi-entity holdings, and private equity holding portfolios requiring consolidated audit logs.",
      features: [
        "Unlimited Multi-Entity Switching",
        "Consolidated Group Balance Sheet Audits",
        "Custom Deterministic Regression Models",
        "Private Slack & Dedicated Financial Architect",
        "Custom Accounting ERP Sync (Netsuite/QBO)",
        "Cryptographic Audit Logs with SLA",
      ],
      highlight: false,
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      {/* Top Editorial Bar */}
      <nav className="border-b border-[#222222] px-6 lg:px-12 h-20 flex items-center justify-between sticky top-0 bg-black/95 backdrop-blur-md z-50">
        <div className="flex items-center space-x-12">
          <Link href="/" className="font-serif text-2xl tracking-[0.35em] font-light uppercase text-white">
            MARGIN
          </Link>
          <div className="hidden md:flex items-center space-x-8 text-[11px] tracking-[0.2em] uppercase text-[#A0A0A0]">
            <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
            <a href="#forecasting" className="hover:text-white transition-colors">Forecasting</a>
            <a href="#simulator" className="hover:text-white transition-colors">Simulator</a>
            <a href="#pricing" className="hover:text-white transition-colors">Capital Access</a>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          <Link
            href="/auth/login"
            className="text-[11px] tracking-[0.2em] uppercase text-[#A0A0A0] hover:text-white transition-colors"
          >
            Sign In
          </Link>
          <Link
            href="/auth/register"
            className="border border-white bg-white text-black px-6 py-2.5 text-[11px] tracking-[0.2em] uppercase font-medium hover:bg-neutral-200 transition-colors"
          >
            Provision Seat
          </Link>
        </div>
      </nav>

      {/* 1. Hero Section */}
      <section className="px-6 lg:px-12 pt-28 pb-32 max-w-7xl mx-auto border-b border-[#222222]">
        <div className="max-w-4xl">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#707070] block mb-5">
            Private Executive Intelligence • Fiscal Architecture
          </span>
          <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl font-light tracking-tight text-white leading-[1.05]">
            Understand your business. <br />
            <span className="italic font-serif font-extralight text-[#A0A0A0]">Shape what comes next.</span>
          </h1>
          <p className="mt-8 text-base sm:text-lg text-[#A0A0A0] font-light max-w-2xl leading-relaxed">
            Financial intelligence designed to help businesses see clearly, plan confidently, and make better decisions. Built with timeless architectural discipline.
          </p>

          <div className="mt-12 flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-5">
            <Link
              href="/overview"
              className="bg-white text-black px-8 py-3.5 text-xs tracking-[0.25em] uppercase font-medium text-center hover:bg-neutral-200 transition-colors"
            >
              Explore the Platform
            </Link>
            <Link
              href="/auth/register"
              className="border border-[#333333] bg-transparent text-white px-8 py-3.5 text-xs tracking-[0.25em] uppercase font-light text-center hover:border-white transition-colors"
            >
              Get Started
            </Link>
          </div>
        </div>

        {/* Ticker */}
        <div className="mt-28 grid grid-cols-2 md:grid-cols-4 gap-8 pt-12 border-t border-[#1c1c1c]">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Architecture</span>
            <div className="font-serif text-3xl font-light text-white">$4.2M+</div>
            <span className="text-xs text-[#707070] mt-0.5 block">Ledger Volume Modeled</span>
          </div>
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Projection Accuracy</span>
            <div className="font-serif text-3xl font-light text-white">99.4%</div>
            <span className="text-xs text-[#707070] mt-0.5 block">Deterministic Parity</span>
          </div>
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Decisional Latency</span>
            <div className="font-serif text-3xl font-light text-white">&lt;100ms</div>
            <span className="text-xs text-[#707070] mt-0.5 block">Zero Cloud Lag</span>
          </div>
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-1">Security Fabric</span>
            <div className="font-serif text-3xl font-light text-white">RLS</div>
            <span className="text-xs text-[#707070] mt-0.5 block">Row-Level Cryptographic</span>
          </div>
        </div>
      </section>

      {/* 2. Capabilities Matrix */}
      <section id="capabilities" className="px-6 lg:px-12 py-28 max-w-7xl mx-auto border-b border-[#222222]">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 pb-6 border-b border-[#1c1c1c]">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block mb-2">Capability Matrix</span>
            <h2 className="font-serif text-4xl sm:text-5xl font-light text-white">An Uncompromised Instrument</h2>
          </div>
          <p className="text-xs tracking-wider uppercase text-[#707070] mt-4 md:mt-0 max-w-xs">
            Engineered without generic SaaS templates, clutter, or visual noise.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="border border-[#222222] bg-[#0A0A0A] p-8 flex flex-col justify-between h-80">
            <div>
              <SlidersHorizontal size={20} className="text-[#A0A0A0] mb-6 stroke-1" />
              <h3 className="font-serif text-2xl font-light text-white mb-3">Live Ledger Cockpit</h3>
              <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                Aggregated revenue, expense categorization, net operating margin, and verified runway calculated dynamically without batch processing delays.
              </p>
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white border-t border-[#1c1c1c] pt-4 flex items-center justify-between">
              <span>Section 01</span>
              <ArrowUpRight size={12} />
            </div>
          </div>

          <div className="border border-[#222222] bg-[#0A0A0A] p-8 flex flex-col justify-between h-80">
            <div>
              <Cpu size={20} className="text-[#A0A0A0] mb-6 stroke-1" />
              <h3 className="font-serif text-2xl font-light text-white mb-3">Hypothetical Simulator</h3>
              <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                Simulate hiring headcount, altering product pricing curves, or scaling advertising spend before committing real balance sheet reserves.
              </p>
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white border-t border-[#1c1c1c] pt-4 flex items-center justify-between">
              <span>Section 02</span>
              <ArrowUpRight size={12} />
            </div>
          </div>

          <div className="border border-[#222222] bg-[#0A0A0A] p-8 flex flex-col justify-between h-80">
            <div>
              <Sparkles size={20} className="text-[#A0A0A0] mb-6 stroke-1" />
              <h3 className="font-serif text-2xl font-light text-white mb-3">Executive Copilot</h3>
              <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                Deterministic LLM intelligence grounded directly in your entity’s verified accounting ledger to uncover margin compression and burn risks.
              </p>
            </div>
            <div className="text-[10px] tracking-[0.2em] uppercase text-white border-t border-[#1c1c1c] pt-4 flex items-center justify-between">
              <span>Section 03</span>
              <ArrowUpRight size={12} />
            </div>
          </div>
        </div>
      </section>

      {/* 3. Pricing Matrix Section */}
      <section id="pricing" className="px-6 lg:px-12 py-28 max-w-7xl mx-auto border-b border-[#222222]">
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-[10px] tracking-[0.3em] uppercase text-[#707070] block mb-2">
            Capital Access Allocation
          </span>
          <h2 className="font-serif text-4xl sm:text-5xl font-light text-white">
            Reserved Intelligence Seats
          </h2>
          <p className="mt-4 text-xs text-[#A0A0A0] font-light leading-relaxed">
            Institutional-grade financial modeling priced with transparency. Zero tiered feature penalties or hidden telemetry fees.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`p-8 sm:p-10 flex flex-col justify-between border ${
                t.highlight ? "border-white bg-[#121212]" : "border-[#222222] bg-[#0A0A0A]"
              }`}
            >
              <div>
                <div className="flex justify-between items-center pb-4 border-b border-[#222222]">
                  <h3 className="font-serif text-2xl font-light text-white">{t.name}</h3>
                  {t.highlight && (
                    <span className="text-[9px] uppercase tracking-widest bg-white text-black px-2 py-0.5 font-medium">
                      Recommended
                    </span>
                  )}
                </div>

                <div className="mt-6 mb-4">
                  <span className="font-serif text-5xl font-light text-white">{t.price}</span>
                  <span className="text-xs text-[#707070] ml-2 block sm:inline font-mono">{t.cadence}</span>
                </div>

                <p className="text-xs text-[#A0A0A0] font-light mb-8 leading-relaxed">
                  {t.desc}
                </p>

                <div className="space-y-3.5 border-t border-[#222222] pt-6 mb-8 text-xs font-sans">
                  {t.features.map((f) => (
                    <div key={f} className="flex items-center space-x-3 text-neutral-300">
                      <Check size={13} className="text-white shrink-0" />
                      <span className="font-light">{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <Link
                href="/auth/register"
                className={`w-full py-3 text-xs uppercase tracking-[0.2em] font-medium text-center transition-colors block ${
                  t.highlight
                    ? "bg-white text-black hover:bg-neutral-200"
                    : "border border-[#333] text-white hover:border-white"
                }`}
              >
                Provision Seat
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Final Editorial CTA */}
      <section className="px-6 lg:px-12 py-32 max-w-7xl mx-auto text-center">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#707070] block mb-4">
          Institutional Certainty
        </span>
        <h2 className="font-serif text-5xl sm:text-7xl font-light text-white max-w-3xl mx-auto leading-tight">
          Assume command of your balance sheet.
        </h2>
        <div className="mt-10 flex justify-center space-x-4">
          <Link
            href="/auth/register"
            className="bg-white text-black px-10 py-4 text-xs tracking-[0.25em] uppercase font-medium hover:bg-neutral-200 transition-colors"
          >
            Provision Intelligence Seat
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[#222222] px-6 lg:px-12 py-16 max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center text-xs text-[#707070] gap-6">
        <div>
          <span className="font-serif tracking-[0.3em] uppercase text-white text-base block mb-1">M A R G I N</span>
          <span>&copy; 2026 Margin Platform Inc. All rights reserved.</span>
        </div>
        <div className="flex space-x-8 text-[10px] tracking-[0.2em] uppercase">
          <Link href="/overview" className="hover:text-white transition-colors">Overview</Link>
          <a href="#capabilities" className="hover:text-white transition-colors">Capabilities</a>
          <a href="#pricing" className="hover:text-white transition-colors">Capital Access</a>
          <Link href="/auth/login" className="hover:text-white transition-colors">Portal Login</Link>
        </div>
      </footer>
    </div>
  );
}
