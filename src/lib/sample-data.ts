export interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: "income" | "expense";
  category: string;
  date: string;
}

export interface FinancialSummary {
  totalRevenue: number;
  totalExpenses: number;
  netProfit: number;
  profitMargin: number;
  cashPosition: number;
  runwayMonths: number;
}

export interface MonthlyPerformance {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface ExpenseCategoryItem {
  name: string;
  amount: number;
  percentage: number;
}

export const MONTHLY_PERFORMANCE: MonthlyPerformance[] = [
  { month: "May", revenue: 42000, expenses: 28500, profit: 13500 },
  { month: "Jun", revenue: 48500, expenses: 31000, profit: 17500 },
  { month: "Jul", revenue: 56000, expenses: 32500, profit: 23500 },
  { month: "Aug", revenue: 61200, expenses: 35000, profit: 26200 },
  { month: "Sep", revenue: 69800, expenses: 37400, profit: 32400 },
  { month: "Oct", revenue: 78500, expenses: 39800, profit: 38700 },
];

export const EXPENSE_CATEGORIES: ExpenseCategoryItem[] = [
  { name: "Payroll & Contractors", amount: 19500, percentage: 49 },
  { name: "Cloud & Infrastructure", amount: 8200, percentage: 21 },
  { name: "Performance Acquisition", amount: 6400, percentage: 16 },
  { name: "Legal & Advisory", amount: 3500, percentage: 9 },
  { name: "Office & Operations", amount: 2200, percentage: 5 },
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: "TX-9041",
    description: "Enterprise SaaS Annual Retainer — Acme Corp",
    amount: 36000,
    type: "income",
    category: "Revenue",
    date: "2026-10-28",
  },
  {
    id: "TX-9040",
    description: "AWS Cloud Infrastructure & Compute Cluster",
    amount: 4280,
    type: "expense",
    category: "Software",
    date: "2026-10-26",
  },
  {
    id: "TX-9039",
    description: "Strategic Architecture Advisory — K&L Gates",
    amount: 3500,
    type: "expense",
    category: "Professional Services",
    date: "2026-10-24",
  },
  {
    id: "TX-9038",
    description: "Fintech Platform Subscription Inflow — Horizon LLC",
    amount: 14500,
    type: "income",
    category: "Revenue",
    date: "2026-10-21",
  },
  {
    id: "TX-9037",
    description: "Engineering Core Team Payroll & Compensation",
    amount: 19500,
    type: "expense",
    category: "Payroll",
    date: "2026-10-15",
  },
  {
    id: "TX-9036",
    description: "Google Ads Growth Marketing Engine",
    amount: 2800,
    type: "expense",
    category: "Marketing",
    date: "2026-10-12",
  },
];

export const INITIAL_SUMMARY: FinancialSummary = {
  totalRevenue: 50500,
  totalExpenses: 30080,
  netProfit: 20420,
  profitMargin: 40.4,
  cashPosition: 620420,
  runwayMonths: 20.6,
};
