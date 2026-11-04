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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#0A0A0A] border border-[#222222] w-full max-w-lg p-6 sm:p-8">
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-[#222222]">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070]">General Ledger</span>
            <h2 className="font-serif text-2xl text-white font-light mt-1">Record Ledger Entry</h2>
          </div>
          <button
            onClick={() => setIsRecordModalOpen(false)}
            className="text-[#707070] hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-sans">
          <div className="grid grid-cols-2 gap-2 p-1 bg-black border border-[#222222]">
            <button
              type="button"
              onClick={() => { setType("income"); setCategory("Revenue"); }}
              className={`py-2 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                type === "income" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
              }`}
            >
              Income / Inflow
            </button>
            <button
              type="button"
              onClick={() => { setType("expense"); setCategory("Software"); }}
              className={`py-2 text-[10px] tracking-[0.2em] uppercase transition-colors ${
                type === "expense" ? "bg-white text-black font-medium" : "text-[#707070] hover:text-white"
              }`}
            >
              Expense / Outflow
            </button>
          </div>

          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1">
              Description / Counterparty
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Stripe Settlement or AWS Compute"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-black border border-[#222222] px-3 py-2 text-white placeholder-[#404040] focus:outline-none focus:border-white text-xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1">
                Amount (USD)
              </label>
              <input
                type="number"
                step="0.01"
                required
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-black border border-[#222222] px-3 py-2 text-white placeholder-[#404040] focus:outline-none focus:border-white text-xs"
              />
            </div>

            <div>
              <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-black border border-[#222222] px-3 py-2 text-white focus:outline-none focus:border-white text-xs"
              >
                {type === "income" ? (
                  <>
                    <option value="Revenue">Direct Platform Revenue</option>
                    <option value="Professional Services">Advisory / Retainer</option>
                  </>
                ) : (
                  <>
                    <option value="Payroll">Payroll & Contractors</option>
                    <option value="Software">Cloud & Software</option>
                    <option value="Marketing">Performance Marketing</option>
                    <option value="Operations">Operations & Facilities</option>
                    <option value="Professional Services">Legal & Advisory</option>
                  </>
                )}
              </select>
            </div>
          </div>

          <div>
            <label className="block uppercase text-[10px] tracking-widest text-[#707070] mb-1">
              Transaction Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full bg-black border border-[#222222] px-3 py-2 text-white focus:outline-none focus:border-white text-xs"
            />
          </div>

          <div className="pt-4 flex justify-end space-x-3 border-t border-[#1c1c1c]">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={() => setIsRecordModalOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit" variant="primary" size="sm">
              Commit Ledger Entry
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
