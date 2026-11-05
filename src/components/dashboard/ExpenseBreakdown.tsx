"use client";
import React from "react";
import { useFinancial } from "@/context/FinancialContext";

export const ExpenseBreakdown: React.FC = () => {
  const { transactions } = useFinancial();
  const expenses = transactions.filter(t => t.type === 'expense');
  const total = expenses.reduce((acc, curr) => acc + curr.amount, 0);

  if (transactions.length === 0) return (
    <div className="liquid-glass p-8 text-center text-[#707070] text-xs">No ledger data to analyze. Import your statement.</div>
  );

  return (
    <div className="liquid-glass p-8">
      <h3 className="font-serif text-2xl text-white font-light mb-6">Expense Breakdown</h3>
      {expenses.length === 0 ? <p className="text-xs">No expenses recorded.</p> : (
         /* Add logic here to group by category */
         <div className="text-white font-mono">${total.toLocaleString()}</div>
      )}
    </div>
  );
};
