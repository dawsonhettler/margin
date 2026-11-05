"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Transaction, FinancialSummary } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/client";

export interface SavedScenario { 
  id: string; 
  name: string; 
  decisionType: string; 
  assumptions: any; 
  outcomes: any; 
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
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [summary, setSummary] = useState<FinancialSummary>({
    totalRevenue: 0, 
    totalExpenses: 0, 
    netProfit: 0, 
    profitMargin: 0, 
    cashPosition: 150000, 
    runwayMonths: 36.0
  });

  const [activeBusiness, setActiveBusiness] = useState("Configure Business...");
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<"income" | "expense">("income");
  const [isLoading, setIsLoading] = useState(true);
  const [scenarios, setScenarios] = useState<SavedScenario[]>([]);

  // Dynamically calculate KPIs based strictly on current state
  useEffect(() => {
    let rev = 0;
    let exp = 0;
    let initialOpeningCash = 150000;

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
      runwayMonths: isFinite(runway) ? runway : 36.0,
    });
  }, [transactions]);

  // Fetch real data from Supabase
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

        if (txData) {
          setTransactions(
            txData.map((t: any) => ({
              id: t.id,
              description: t.description,
              amount: parseFloat(t.amount),
              type: t.transaction_type,
              category: t.category,
              date: t.transaction_date,
            }))
          );
        }

        const { data: scenarioData } = await supabase
          .from("business_scenarios")
          .select("*")
          .eq("business_id", currentBiz.id);

        if (scenarioData) {
          setScenarios(
            scenarioData.map((s: any) => ({
              id: s.id,
              name: s.scenario_name,
              decisionType: s.scenario_data?.decisionType,
              assumptions: s.scenario_data?.assumptions,
              outcomes: s.scenario_data?.outcomes,
              createdAt: s.created_at,
            }))
          );
        }
      }
    } catch (err) { 
      console.warn("Supabase fetch warning:", err); 
    } finally { 
      setIsLoading(false); 
    }
  }, []);

  useEffect(() => { 
    fetchSupabaseData(); 
  }, [fetchSupabaseData]);

  const addTransaction = async (tx: Omit<Transaction, "id">) => {
    const tempId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    setTransactions((prev) => [{ ...tx, id: tempId }, ...prev]);
    
    const supabase = createClient();
    if (supabase && activeBusinessId) {
      const { data } = await supabase
        .from("transactions")
        .insert({ 
          business_id: activeBusinessId, 
          transaction_type: tx.type, 
          description: tx.description, 
          category: tx.category, 
          amount: tx.amount, 
          transaction_date: tx.date 
        })
        .select()
        .single();

      if (data) {
        setTransactions((prev) => prev.map((t) => (t.id === tempId ? { ...t, id: data.id } : t)));
      }
    }
  };

  const deleteTransaction = async (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    const supabase = createClient();
    if (supabase) {
      await supabase.from("transactions").delete().eq("id", id);
    }
  };

  const saveScenario = async (name: string, decisionType: string, assumptions: any, outcomes: any) => {
    const tempId = `SCN-${Date.now()}`;
    setScenarios((prev) => [{ id: tempId, name, decisionType, assumptions, outcomes, createdAt: new Date().toISOString() }, ...prev]);
    
    const supabase = createClient();
    if (supabase && activeBusinessId) {
      const { data } = await supabase
        .from("business_scenarios")
        .insert({ 
          business_id: activeBusinessId, 
          scenario_name: name, 
          scenario_data: { decisionType, assumptions, outcomes } 
        })
        .select()
        .single();

      if (data) {
        setScenarios((prev) => prev.map((s) => (s.id === tempId ? { ...s, id: data.id } : s)));
      }
    }
  };

  const deleteScenario = async (id: string) => {
    setScenarios((prev) => prev.filter((s) => s.id !== id));
    const supabase = createClient();
    if (supabase) {
      await supabase.from("business_scenarios").delete().eq("id", id);
    }
  };

  const openRecordModal = (type: "income" | "expense" = "income") => { 
    setModalDefaultType(type); 
    setIsRecordModalOpen(true); 
  };

  return (
    <FinancialContext.Provider value={{ transactions, summary, addTransaction, deleteTransaction, activeBusiness, activeBusinessId, setActiveBusiness, isRecordModalOpen, setIsRecordModalOpen, modalDefaultType, openRecordModal, isLoading, scenarios, saveScenario, deleteScenario }}>
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const ctx = useContext(FinancialContext);
  if (!ctx) throw new Error("useFinancial must be used within FinancialProvider");
  return ctx;
};
