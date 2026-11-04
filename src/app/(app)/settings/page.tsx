"use client";
import React from "react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";

export default function SettingsPage() {
  const { activeBusiness, setActiveBusiness } = useFinancial();

  return (
    <div className="space-y-8 max-w-2xl pb-16">
      <div className="pb-6 border-b border-[#222222]">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block">Platform Configuration</span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">Entity Settings</h1>
      </div>

      <div className="border border-[#222222] bg-[#0A0A0A] p-8 space-y-6 text-xs font-sans">
        <div>
          <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
            Active Operating Entity
          </label>
          <input
            type="text"
            value={activeBusiness}
            onChange={(e) => setActiveBusiness(e.target.value)}
            className="w-full bg-black border border-[#222222] px-3 py-2 text-white text-xs focus:outline-none focus:border-white"
          />
        </div>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
            Functional Accounting Currency
          </label>
          <select className="w-full bg-black border border-[#222222] px-3 py-2 text-white focus:outline-none cursor-pointer">
            <option>USD ($) — United States Dollar</option>
            <option>EUR (€) — Eurozone</option>
            <option>GBP (£) — British Pound</option>
            <option>CHF (Fr) — Swiss Franc</option>
          </select>
        </div>

        <div>
          <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1.5">
            Fiscal Year Accounting Standard
          </label>
          <div className="border border-[#222222] p-3 text-[#A0A0A0] text-xs">
            US-GAAP Deterministic Accrual Standard • Calendar Year Cadence
          </div>
        </div>

        <div className="pt-4 border-t border-[#222222]">
          <Button variant="primary" size="sm" onClick={() => alert("Entity preferences saved successfully.")}>
            Save Entity Preferences
          </Button>
        </div>
      </div>
    </div>
  );
}
