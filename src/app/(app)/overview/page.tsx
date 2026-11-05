"use client";
import React, { useState } from "react";
import { UploadCloud, Plus, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { FinancialKpis } from "@/components/dashboard/FinancialKpis";
import { RecentTransactions } from "@/components/dashboard/RecentTransactions";
import { ImportCsvModal } from "@/components/dashboard/ImportCsvModal";
import { useFinancial } from "@/context/FinancialContext";

export default function OverviewPage() {
  const { summary, transactions, setIsRecordModalOpen } = useFinancial();
  const [isCsvModalOpen, setIsCsvModalOpen] = useState(false);

  return (
    <div className="space-y-10 pb-16">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-6 border-b border-[#222222]">
        <h1 className="font-serif text-4xl text-white">Financial Cockpit</h1>
        {transactions.length > 0 && (
          <div className="flex space-x-3">
             <Button variant="secondary" size="sm" onClick={() => setIsCsvModalOpen(true)}>Import</Button>
             <Button variant="primary" size="sm" onClick={() => setIsRecordModalOpen(true)}>Record</Button>
          </div>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="liquid-glass p-16 text-center space-y-6">
          <h3 className="font-serif text-3xl text-white">Your ledger is empty.</h3>
          <p className="text-neutral-400 max-w-sm mx-auto">Import your historical bank statement or record your first transaction to initialize the MARGIN intelligence engine.</p>
          <div className="flex justify-center space-x-4">
            <Button variant="primary" onClick={() => setIsCsvModalOpen(true)}>Import Statement</Button>
            <Button variant="secondary" onClick={() => setIsRecordModalOpen(true)}>Record Manually</Button>
          </div>
        </div>
      ) : (
        <>
          <FinancialKpis summary={summary} />
          <RecentTransactions />
        </>
      )}
      
      <ImportCsvModal isOpen={isCsvModalOpen} onClose={() => setIsCsvModalOpen(false)} />
    </div>
  );
}
