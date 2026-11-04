"use client";
import React from "react";
import { EXPENSE_CATEGORIES } from "@/lib/sample-data";

export const ExpenseBreakdown: React.FC = () => {
  const total = EXPENSE_CATEGORIES.reduce((acc, curr) => acc + curr.amount, 0);

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <div className="pb-6 mb-6 border-b border-[#222222]">
          <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block">
            Capital Allocation
          </span>
          <h3 className="font-serif text-2xl text-white font-light mt-1">
            Expense Breakdown
          </h3>
        </div>

        <div className="space-y-5">
          {EXPENSE_CATEGORIES.map((item) => (
            <div key={item.name}>
              <div className="flex justify-between text-xs font-sans mb-1.5">
                <span className="text-neutral-300 font-light">{item.name}</span>
                <span className="text-white font-medium">
                  ${item.amount.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full bg-[#1c1c1c] h-1">
                <div
                  className="bg-white h-1 transition-all duration-500"
                  style={{ width: `${item.percentage}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-6 mt-8 border-t border-[#222222] flex justify-between items-center text-xs">
        <span className="text-[#707070] uppercase tracking-widest text-[10px]">Total OpEx Pool</span>
        <span className="font-serif text-lg text-white font-light">
          ${total.toLocaleString()}
        </span>
      </div>
    </div>
  );
};
