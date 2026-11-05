"use client";
import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useFinancial } from "@/context/FinancialContext";

export const RecordTransactionModal: React.FC = () => {
  const { isRecordModalOpen, setIsRecordModalOpen, addTransaction, modalDefaultType } = useFinancial();

  const [type, setType] = useState<"income" | "expense">(modalDefaultType);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("Revenue");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (isRecordModalOpen) {
      setType(modalDefaultType);
      setCategory(modalDefaultType === "income" ? "Revenue" : "Software");
      setDate(new Date().toISOString().split("T")[0]);
    }
  }, [modalDefaultType, isRecordModalOpen]);

  if (!isRecordModalOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description || !amount) return;

    addTransaction({
      description,
      amount: parseFloat(amount),
      type,
      category,
      date: date || new Date().toISOString().split("T")[0],
    });

    setDescription("");
    setAmount("");
    setIsRecordModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 backdrop-blur-xl p-4 animate-in fade-in duration-200">
      <div className="liquid-glass-elevated w-full max-w-lg p-6 sm:p-8 border border-white/20 shadow-[0_25px_70px_rgba(0,0,0,0.9)]">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-white/[0.08]">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500">General Ledger</span>
            <h2 className="font-serif text-2xl text-white font-light mt-1">Record Ledger Entry</h2>
          </div>
          <button
            onClick={() => setIsRecordModalOpen(false)}
            className="text-neutral-400 hover:text-white transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-2 p-1 bg-black/60 border border-white/10">
            <button
              type="button"
              onClick={() => { setType("income"); setCategory("Revenue"); }}
              className={`py-2 text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer ${
                type === "income" ? "bg-white text-black font-medium shadow-md" : "text-neutral-400 hover:text-white"
              }`}
            >
              Income / Inflow
            </button>
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory("Software"); }}
              className={`py-2 text-[10px] tracking-[0.2em] uppercase transition-all cursor-pointer ${
                type === "expense" ? "bg-white text-black font-medium shadow-md" : "text-neutral-400 hover:text-white"
              }`}
            >
              Expense / Outflow
            </button>
          </div>

          <div>
            <label className="block uppercase text-[10px] tracking-widest text-neutral-400 mb-1">
              Description / Counterparty
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe Settlement or AWS Compute"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black/80 border border-white/15 px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-[10px] tracking-widest text-neutral-400 mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black/80 border border-white/15 px-3.5 py-2.5 text-white placeholder-neutral-600 focus:outline-none focus:border-white text-xs font-mono"
              />
            </div>

            <div>
              <label className="block uppercase text-[10px] tracking-widest text-neutral-400 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black/80 border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-white text-xs cursor-pointer"
              >
                {type === "income" ? (
                  <>
                    <option value="Revenue" className="bg-neutral-900 text-white">Direct Platform Revenue</option>
                    <option value="Professional Services" className="bg-neutral-900 text-white">Advisory / Retainer</option>
                  </>
                ) : (
                  <>
                    <option value="Payroll" className="bg-neutral-900 text-white">Payroll & Contractors</option>
                    <option value="Software" className="bg-neutral-900 text-white">Cloud & Software</option>
                    <option value="Marketing" className="bg-neutral-900 text-white">Performance Marketing</option>
                    <option value="Operations" className="bg-neutral-900 text-white">Operations & Facilities</option>
                    <option value="Professional Services" className="bg-neutral-900 text-white">Legal & Advisory</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block uppercase text-[10px] tracking-widest text-neutral-400 mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black/80 border border-white/15 px-3.5 py-2.5 text-white focus:outline-none focus:border-white text-xs font-mono"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-white/[0.08]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsRecordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="primary" size="sm">
              Commit Ledger Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
