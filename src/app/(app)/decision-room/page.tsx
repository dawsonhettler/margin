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
import {
  Users,
  Tag,
  Megaphone,
  Building,
  Package,
  Sliders,
  BookmarkPlus,
  Trash2,
  AlertTriangle,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { PaywallGate } from "@/components/ui/PaywallGate";
import { useFinancial } from "@/context/FinancialContext";

type DecisionType = "hiring" | "pricing" | "ads" | "expansion" | "product";
type CaseMode = "expected" | "best" | "worst";

export default function DecisionRoomPage() {
  const { summary, scenarios, saveScenario, deleteScenario, subscriptionTier } = useFinancial();
  const [mounted, setMounted] = useState(false);
  const [decisionType, setDecisionType] = useState<DecisionType>("hiring");
  const [caseMode, setCaseMode] = useState<CaseMode>("expected");
  const [scenarioName, setScenarioName] = useState("");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Free users are locked out of Decision Room unless they subscribe
  const isLocked = subscriptionTier === "free";

  useEffect(() => { setMounted(true); }, []);
  // ... [Rest of Decision Room logic remains identical] ...

  return (
    <PaywallGate featureName="MARGIN Decision Room" requiredTier="Venture Partner ($480/mo)" isLocked={isLocked}>
      <div className="space-y-10 pb-16 selection:bg-white selection:text-black">
        {/* Same Decision Room UI */}
        <h1 className="font-serif text-3xl text-white">Decision Room Active</h1>
      </div>
    </PaywallGate>
  );
}
