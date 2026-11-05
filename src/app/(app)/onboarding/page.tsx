"use client";
import React, { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Papa from "papaparse";
import { UploadCloud, Building2, ArrowRight, CheckCircle2, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";
import { createClient } from "@/lib/supabase/client";

export default function OnboardingPage() {
  const router = useRouter();
  const { setActiveBusiness, addTransaction } = useFinancial();
  const [step, setStep] = useState<1 | 2>(1);
  const [companyName, setCompanyName] = useState("");
  const [currency, setCurrency] = useState("USD");
  const [openingCash, setOpeningCash] = useState("150000");
  const [importing, setImporting] = useState(false);
  const [importedCount, setImportedCount] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!companyName.trim()) return;

    setActiveBusiness(companyName);

    const supabase = createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Create business entity
        const { data: biz } = await supabase.from("businesses").insert({
          owner_id: user.id,
          business_name: companyName,
          currency,
        }).select().single();

        if (biz) {
          // Commit opening balance as initial equity / cash injection
          await supabase.from("transactions").insert({
            business_id: biz.id,
            transaction_type: "income",
            description: "Initial Treasury Opening Balance",
            category: "Revenue",
            amount: parseFloat(openingCash) || 150000,
            transaction_date: new Date().toISOString().split("T")[0],
          });
        }
      }
    }

    setStep(2);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImporting(true);

    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        let count = 0;
        for (const row of results.data.slice(0, 150) as any[]) {
          const date = row.Date || row.date || row["Posting Date"] || new Date().toISOString().split("T")[0];
          const desc = row.Description || row.description || row.Name || "Bank Transaction";
          const rawAmount = row.Amount || row.amount || "0";
          const cleaned = typeof rawAmount === "string" ? parseFloat(rawAmount.replace(/[$, ]/g, "")) : rawAmount;
          const isNegative = cleaned < 0;

          await addTransaction({
            description: desc,
            amount: Math.abs(cleaned) || 100,
            type: isNegative ? "expense" : "income",
            category: isNegative ? "Operations" : "Revenue",
            date,
          });
          count++;
        }
        setImportedCount(count);
        setImporting(false);
        setTimeout(() => {
          router.push("/overview");
        }, 1500);
      },
    });
  };

  const handleFinish = () => {
    router.push("/overview");
  };

  return (
    <div className="max-w-2xl mx-auto py-12 space-y-8 selection:bg-white selection:text-black">
      <div className="text-center pb-6 border-b border-[#222222]">
        <span className="text-[10px] tracking-[0.3em] uppercase text-[#707070] block mb-1 font-sans">
          Treasury Initialization • Step {step} of 2
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-light text-white uppercase mt-1">
          {step === 1 ? "Configure Operating Entity" : "Import Historical Statement"}
        </h1>
      </div>

      {step === 1 ? (
        <form onSubmit={handleCreateEntity} className="border border-[#222222] bg-[#0A0A0A] p-8 space-y-6 text-xs font-sans">
          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
              Operating Company / Entity Name
            </label>
            <div className="flex items-center space-x-3 bg-black border border-[#222222] px-3.5 py-2.5">
              <Building2 size={15} className="text-[#707070]" />
              <input
                type="text"
                required
                placeholder="e.g. Aethelgard Technologies Inc."
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full bg-transparent text-xs text-white placeholder-[#505050] focus:outline-none"
                autoFocus
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
                Starting Liquid Cash (USD)
              </label>
              <div className="flex items-center space-x-2 bg-black border border-[#222222] px-3.5 py-2.5">
                <DollarSign size={14} className="text-[#707070]" />
                <input
                  type="number"
                  required
                  step="1000"
                  value={openingCash}
                  onChange={(e) => setOpeningCash(e.target.value)}
                  className="w-full bg-transparent text-xs text-white focus:outline-none font-mono"
                />
              </div>
              <span className="text-[9px] text-[#707070] mt-1 block">Current bank account balance</span>
            </div>

            <div>
              <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
                Accounting Currency
              </label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full bg-black border border-[#222222] px-3.5 py-2.5 text-white focus:outline-none cursor-pointer text-xs"
              >
                <option value="USD">USD ($) — United States Dollar</option>
                <option value="EUR">EUR (€) — Eurozone</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="CHF">CHF (Fr) — Swiss Franc</option>
              </select>
            </div>
          </div>

          <div className="pt-4 border-t border-[#222222] flex justify-end">
            <Button type="submit" variant="primary" size="md">
              <span>Initialize Balance Sheet</span>
              <ArrowRight size={14} className="ml-2" />
            </Button>
          </div>
        </form>
      ) : (
        <div className="border border-[#222222] bg-[#0A0A0A] p-8 space-y-6 text-xs font-sans text-center">
          {importedCount > 0 ? (
            <div className="py-8 space-y-4">
              <CheckCircle2 size={40} className="text-emerald-400 mx-auto" />
              <h3 className="font-serif text-2xl text-white font-light">
                Successfully Imported {importedCount} Transactions!
              </h3>
              <p className="text-xs text-[#A0A0A0]">
                Redirecting to your live Financial Cockpit...
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-xs text-[#A0A0A0] font-light leading-relaxed">
                Your opening balance of <strong className="text-white">${parseFloat(openingCash || "0").toLocaleString()}</strong> is set. You can now upload your historical bank statement (.csv) or enter your first transactions manually inside the cockpit.
              </p>

              <div
                onClick={() => fileInputRef.current?.click()}
                className="border border-dashed border-[#333333] hover:border-white p-10 text-center cursor-pointer transition-colors bg-black"
              >
                <UploadCloud size={32} className="text-[#707070] mx-auto mb-3" />
                <div className="text-xs text-white uppercase tracking-wider font-medium">
                  {importing ? "Parsing and committing to PostgreSQL..." : "Click to Upload Bank / Stripe CSV (Optional)"}
                </div>
                <p className="text-[11px] text-[#707070] mt-1 font-light">
                  Mercury, Chase, Brex, Stripe, and QuickBooks supported.
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-[#222222]">
                <span className="text-[11px] text-[#707070]">Starting fresh? You can record entries anytime.</span>
                <Button variant="primary" size="sm" onClick={handleFinish}>
                  Enter Financial Cockpit
                </Button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
