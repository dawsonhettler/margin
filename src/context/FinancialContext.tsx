"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { INITIAL_TRANSACTIONS, INITIAL_SUMMARY, Transaction, FinancialSummary } from "@/lib/sample-data";
import { createClient } from "@/lib/supabase/client";

interface FinancialContextType {
  transactions: Transaction[];
  summary: FinancialSummary;
  addTransaction: (tx: Omit<Transaction, "id">) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  activeBusiness: string;
  setActiveBusiness: (name: string) => void;
  isRecordModalOpen: boolean;
  setIsRecordModalOpen: (open: boolean) => void;
  modalDefaultType: "income" | "expense";
  openRecordModal: (type?: "income" | "expense") => void;
  isLoading: boolean;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

export const FinancialProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [summary, setSummary] = useState<FinancialSummary>(INITIAL_SUMMARY);
  const [activeBusiness, setActiveBusiness] = useState("Vanguard Studio Inc.");
  const [activeBusinessId, setActiveBusinessId] = useState<string | null>(null);
  const [isRecordModalOpen, setIsRecordModalOpen] = useState(false);
  const [modalDefaultType, setModalDefaultType] = useState<"income" | "expense">("income");
  const [isLoading, setIsLoading] = useState(true);

  // Recalculate financial KPIs dynamically whenever transactions change
  useEffect(() => {
    let rev = 0;
    let exp = 0;

    transactions.forEach((tx) => {
      if (tx.type === "income") rev += tx.amount;
      if (tx.type === "expense") exp += tx.amount;
    });

    const net = rev - exp;
    const margin = rev > 0 ? parseFloat(((net / rev) * 100).toFixed(1)) : 0;
    const cash = 600000 + net;
    const runway = exp > 0 ? parseFloat((cash / (exp / 3)).toFixed(1)) : 24.0;

    setSummary({
      totalRevenue: rev,
      totalExpenses: exp,
      netProfit: net,
      profitMargin: margin,
      cashPosition: cash,
      runwayMonths: runway,
    });
  }, [transactions]);

  // Load real data from Supabase if logged in
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

      // Fetch user's business
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

        // Fetch transactions for this business
        const { data: txData } = await supabase
          .from("transactions")
          .select("*")
          .eq("business_id", currentBiz.id)
          .order("transaction_date", { ascending: false });

        if (txData && txData.length > 0) {
          const mapped: Transaction[] = txData.map((t) => ({
            id: t.id,
            description: t.description,
            amount: parseFloat(t.amount),
            type: t.transaction_type,
            category: t.category,
            date: t.transaction_date,
          }));
          setTransactions(mapped);
        }
      }
    } catch (err) {
      console.warn("Supabase fetch fallback to sample data:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSupabaseData();
  }, [fetchSupabaseData]);

  // Insert Transaction into Supabase and local state
  const addTransaction = async (tx: Omit<Transaction, "id">) => {
    const tempId = `TX-${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: Transaction = { ...tx, id: tempId };

    // Optimistic UI update
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
          // Replace temp ID with Supabase UUID
          setTransactions((prev) =>
            prev.map((t) => (t.id === tempId ? { ...t, id: data.id } : t))
          );
        }
      } catch (err) {
        console.error("Failed to commit transaction to Supabase:", err);
      }
    }
  };

  // Delete Transaction from Supabase and local state
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
        setActiveBusiness,
        isRecordModalOpen,
        setIsRecordModalOpen,
        modalDefaultType,
        openRecordModal,
        isLoading,
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
