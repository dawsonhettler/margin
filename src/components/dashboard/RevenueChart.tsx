"use client";
import React, { useState, useEffect } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { MONTHLY_PERFORMANCE } from "@/lib/sample-data";

export const RevenueChart: React.FC = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="border border-[#222222] bg-[#0A0A0A] p-6 sm:p-8 flex flex-col justify-between">
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 mb-6 border-b border-[#222222] gap-2">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block">
              Trajectory
            </span>
            <h3 className="font-serif text-2xl text-white font-light mt-1">
              Revenue & Expense Trajectory
            </h3>
          </div>
          <span className="text-[10px] tracking-widest uppercase text-[#707070] border border-[#222222] px-3 py-1">
            Trailing 6 Months
          </span>
        </div>

        <div className="h-72 w-full">
          {mounted ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={MONTHLY_PERFORMANCE} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FFFFFF" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#FFFFFF" stopOpacity={0.0} />
                  </linearGradient>
                  <linearGradient id="expenseGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#707070" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#707070" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#1c1c1c" vertical={false} strokeDasharray="2 2" />
                <XAxis
                  dataKey="month"
                  stroke="#525252"
                  tickLine={false}
                  axisLine={{ stroke: "#262626" }}
                  style={{ fontSize: "11px" }}
                />
                <YAxis
                  stroke="#525252"
                  tickLine={false}
                  axisLine={{ stroke: "#262626" }}
                  tickFormatter={(v) => `$${v / 1000}k`}
                  style={{ fontSize: "11px" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#0A0A0A",
                    borderColor: "#333333",
                    fontSize: "12px",
                    color: "#FFFFFF",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#FFFFFF"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#revenueGrad)"
                />
                <Area
                  type="monotone"
                  dataKey="expenses"
                  stroke="#707070"
                  strokeWidth={1.5}
                  fillOpacity={1}
                  fill="url(#expenseGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-full w-full flex items-center justify-center text-[#707070] text-xs">
              Rendering Canvas...
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-6 pt-4 border-t border-[#222222] text-[11px] text-[#A0A0A0]">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-0.5 bg-white inline-block" />
          <span>Gross Revenue</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-0.5 bg-[#707070] inline-block" />
          <span>Total Operating Expenses</span>
        </div>
      </div>
    </div>
  );
};
