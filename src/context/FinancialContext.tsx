"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_TRANSACTIONS, INITIAL_SUMMARY, Transaction, FinancialSummary } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/client";

export interface SavedScenario {
  id: string;
  name: string;
  decisionType: string;
  assumptions: Record<string, any>;
  outcomes: {
    monthlyRevDelta: number;
    monthlyExpDelta: number;
    netDelta: number;
    runwayDelta: number;
    breakEvenUnits?: number;
    paybackMonths?: number;
  };
  createdAt: string;
}

interface FinancialContextType {
  transactions: Transaction[];
  summary: FinancialSummary;
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  activeBusiness: string;
  activeBusinessId: string | null;
  setActiveBusiness: (name: string) => void;
  isRecordModalOpen: boolean;
  setIsRecordModalOpen: (open: boolean) => void;
  modalDefaultType: "income" | "expense";
  openRecordModal: (type?: "income" | "expense") => void;
  isLoading: boolean;
  scenarios: SavedScenario[];
  saveScenario: (name: string, decisionType: string, assumptions: any, outcomes: any) => Promise<void>;
  deleteScenario: (id: string) => Promise<void>;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDemoMode, setIsDemoMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "true" || document.cookie.includes("sb-demo-mode=true")) {
        setIsDemoMode(true);
      }
    }
  }, []);

  // ONLY demo mode gets sample data. Real users start completely blank ([])
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "true" || document.cookie.includes("sb-demo-mode=true")) {
        return INITIAL_TRANSACTIONS;
      }
    }
    return [];
  });

  const [summary, setSummary] = useState<FinancialSummary>(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      if (params.get("demo") === "true" || document.cookie.includes("sb-demo-mode=true")) {
        return INITIAL_SUMMARY;
      }
    }
    return {
      totalRevenue: 0,
      totalExpenses: 0,
      netProfit: 0,
      profitMargin: 0,
      cashPosition: 150000,
      runwayMonths: 36.0,
    };
  });

  const [activeBusiness, setActiveBusiness] = useState("Vanguard Studio Inc.");
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<"income" | "expense">("income");
  const [isLoading, setIsLoading] = useState(true);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  // Recalculate financial KPIs dynamically
  useEffect(() => {
    let rev = 0;
    let exp = 0;
    let initialOpeningCash = isDemoMode ? 600000 : 150000;

    transactions.forEach((tx) => {
      if (tx.description.includes("Opening Balance") || tx.description.includes("Initial Treasury")) {
        initialOpeningCash = tx.amount;
        return;
      }
      if (tx.type === "income") rev += tx.amount;
      if (tx.type === "expense") exp += tx.amount;
    });

    const net = rev - exp;
    const margin = rev > 0 ? parseFloat(((net / rev) * 100).toFixed(1)) : 0;
    const cash = initialOpeningCash + net;
    const monthlyBurn = exp > 0 ? exp / 3 : 1;
    const runway = monthlyBurn > 0 ? parseFloat((cash / monthlyBurn).toFixed(1)) : 36.0;

    setSummary({
      totalRevenue: rev,
      totalExpenses: exp,
      netProfit: net,
      profitMargin: isNaN(margin) ? 0 : margin,
      cashPosition: isNaN(cash) ? 150000 : cash,
      runwayMonths: isNaN(runway) || !isFinite(runway) ? 36.0 : runway,
    });
  }, [transactions, isDemoMode]);

  const fetchSupabaseData = useCallback(async () => {
    const supabase = createClient();
    if (!supabase) {
      setIsLoading(false);
      return;
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setIsLoading(false);
        return;
      }

      const { data: bizData } = await supabase
        .from("businesses")
        .select("id, business_name")
        .eq("owner_id", user.id)
        .order("created_at", { ascending: true })
        .limit(1);

      if (bizData && bizData.length > 0) {
        const currentBiz = bizData[0];
        setActiveBusiness(currentBiz.business_name);
        setActiveBusinessId(currentBiz.id);

        const { data: txData } = await supabase
          .from("transactions")
          .select("*")
          .eq("business_id", currentBiz.id)
          .order("transaction_date", { ascending: false });

        // If user has real transactions, load them. Otherwise keep it 100% empty ([])
        if (txData && txData.length > 0) {
          const mapped: Transaction[] = txData.map((t: any) => ({
            id: t.id,
            description: t.description,
            amount: parseFloat(t.amount),
            type: t.transaction_type,
            category: t.category,
            date: t.transaction_date,
          }));
          setTransactions(mapped);
        } else {
          setTransactions([]);
        }

        const { data: scenarioData } = await supabase
          .from("business_scenarios")
          .select("*")
          .eq("business_id", currentBiz.id)
          .order("created_at", { ascending: false });

        if (scenarioData && scenarioData.length > 0) {
          setScenarios(
            scenarioData.map((s: any) => ({
              id: s.id,
              name: s.scenario_name,
              decisionType: s.scenario_data?.decisionType || "General Decision",
              assumptions: s.scenario_data?.assumptions || {},
              outcomes: s.scenario_data?.outcomes || {},
              createdAt: s.created_at,
            }))
          );
        }
      }
    } catch (err) {
      console.warn("Supabase fetch error:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  const addTransaction = async (tx: Omit<Transaction, "id">) => {
    const tempId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = { ...tx, id: tempId };

    setTransactions((prev) => [newTx, ...prev]);

    const supabase = createClient();
    if (supabase && activeBusinessId) {
      try {
        const { data } = await supabase
          .from("transactions")
          .insert({
            business_id: activeBusinessId,
            transaction_type: tx.type,
            description: tx.description,
            category: tx.category,
            amount: tx.amount,
            transaction_date: tx.date,
          })
          .select()
          .single();

        if (data) {
          setTransactions((prev) =>
            prev.map((t) => (t.id === tempId ? { ...t, id: data.id } : t))
          );
        }
      } catch (err) {
        console.error("Failed to commit transaction to Supabase:", err);
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));

    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.from("transactions").delete().eq("id", id);
      } catch (err) {
        console.error("Failed to delete transaction in Supabase:", err);
      }
    }
  };

  const saveScenario = async (name: string, decisionType: string, assumptions: any, outcomes: any) => {
    const tempId = `SCN-${Date.now()}`;
    const newScn: SavedScenario = {
      id: tempId,
      name,
      decisionType,
      assumptions,
      outcomes,
      createdAt: new Date().toISOString(),
    };

    setScenarios((prev) => [newScn, ...prev]);

    const supabase = createClient();
    if (supabase && activeBusinessId) {
      try {
        const { data } = await supabase
          .from("business_scenarios")
          .insert({
            business_id: activeBusinessId,
            scenario_name: name,
            scenario_data: { decisionType, assumptions, outcomes },
          })
          .select()
          .single();

        if (data) {
          setScenarios((prev) =>
            prev.map((s) => (s.id === tempId ? { ...s, id: data.id } : s))
          );
        }
      } catch (err) {
        console.error("Failed to persist scenario in Supabase:", err);
      }
    }
  };

  const deleteScenario = async (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));

    const supabase = createClient();
    if (supabase) {
      try {
        await supabase.from("business_scenarios").delete().eq("id", id);
      } catch (err) {
        console.error("Failed to remove scenario:", err);
      }
    }
  };

  const openRecordModal = (type: "income" | "expense" = "income") => {
    setModalDefaultType(type);
    setIsRecordModalOpen(true);
  };

  return (
    <FinancialContext.Provider
      value={{
        transactions,
        summary,
        addTransaction,
        deleteTransaction,
        activeBusiness,
        activeBusinessId,
        setActiveBusiness,
        isRecordModalOpen,
        setIsRecordModalOpen,
        modalDefaultType,
        openRecordModal,
        isLoading,
        scenarios,
        saveScenario,
        deleteScenario,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error("useFinancial must be used within FinancialProvider");
  return ctx;
};
