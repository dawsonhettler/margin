"use client";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Compass,
  BarChart3,
  TrendingUp,
  Receipt,
  LineChart,
  Sliders,
  Bot,
  FileText,
  Settings,
} from "lucide-react";

export const AppSidebar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Overview", href: "/overview", icon: LayoutDashboard },
    { name: "Decision Room", href: "/decision-room", icon: Compass },
    { name: "Analytics", href: "/analytics", icon: BarChart3 },
    { name: "Revenue", href: "/revenue", icon: TrendingUp },
    { name: "Expenses", href: "/expenses", icon: Receipt },
    { name: "Forecasting", href: "/forecasting", icon: LineChart },
    { name: "Business Simulator", href: "/simulator", icon: Sliders },
    { name: "AI Copilot", href: "/copilot", icon: Bot },
    { name: "Reports", href: "/reports", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-64 border-r border-[#222222] bg-black hidden md:flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        <div className="h-16 px-8 flex items-center border-b border-[#222222]">
          <Link href="/" className="font-serif tracking-[0.35em] text-lg font-light text-white uppercase">
            MARGIN
          </Link>
        </div>

        <nav className="p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`flex items-center space-x-3 px-4 py-2.5 text-xs tracking-wider transition-colors uppercase ${
                  isActive
                    ? "bg-[#121212] text-white border-l-2 border-white font-medium shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
                    : "text-[#707070] hover:text-[#A0A0A0] hover:bg-[#0A0A0A]"
                }`}
              >
                <Icon size={14} className="stroke-[1.5]" />
                <span className="text-[11px]">{link.name}</span>
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="p-6 border-t border-[#222222]">
        <div className="text-[9px] tracking-[0.25em] uppercase text-[#707070] mb-1">
          Ledger Protocol
        </div>
        <div className="font-serif text-xs text-white">US-GAAP Deterministic</div>
      </div>
    </aside>
  );
};
