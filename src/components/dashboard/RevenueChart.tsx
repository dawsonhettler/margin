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
} from "recharts";
import { useFinancial } from "@/context/FinancialContext";

export const RevenueChart: React.FC = () => {
  const { transactions } = useFinancial();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  // Compute live trajectory from real transactions
  const data = useMemo(() => {
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const d = new Date();
      d.setMonth(d.getMonth() - (5 - i));
      return { month: d.toLocaleString('default', { month: 'short' }), revenue: 0, expenses: 0 };
    });

    transactions.forEach(t => {
      const tDate = new Date(t.date);
      const mIdx = last6Months.findIndex(m => m.month === tDate.toLocaleString('default', { month: 'short' }));
      if (mIdx !== -1) {
        if (t.type === 'income') last6Months[mIdx].revenue += t.amount;
        else last6Months[mIdx].expenses += t.amount;
      }
    });
    return last6Months;
  }, [transactions]);

  return (
    <div className="liquid-glass p-8">
      <div className="pb-6 mb-6 border-b border-white/[0.08]">
        <span className="text-[10px] tracking-[0.25em] uppercase text-neutral-500 block">
          Trajectory
        </span>
        <h3 className="font-serif text-2xl text-white font-light mt-1">
          Revenue & Expense Trajectory
        </h3>
      </div>
      <div className="h-72 w-full">
        {mounted && (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data}>
              <CartesianGrid stroke="#222" vertical={false} />
              <XAxis dataKey="month" stroke="#525252" tickLine={false} style={{ fontSize: "11px" }} />
              <YAxis stroke="#525252" tickLine={false} tickFormatter={(v) => `$${v/1000}k`} style={{ fontSize: "11px" }} />
              <Tooltip contentStyle={{ backgroundColor: "#000", borderColor: "#333" }} />
              <Area type="monotone" dataKey="revenue" stroke="#fff" fill="#fff" fillOpacity={0.1} />
              <Area type="monotone" dataKey="expenses" stroke="#707070" fill="#707070" fillOpacity={0.05} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
};
