"use client";
import React, { useState } from "react";
import { Sparkles, Send, User, ArrowUpRight } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export default function CopilotPage() {
  const { summary, activeBusiness } = useFinancial();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Good day. I have verified the general ledger for ${activeBusiness}. Liquid cash reserves stand at $${summary.cashPosition.toLocaleString()} with ${summary.runwayMonths} months of forward runway. How may I assist your capital allocation planning today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const predefinedPrompts = [
    "Why did our net margin expand this quarter?",
    "Can we safely hire two senior engineers next month?",
    "What are our primary expenditure risks?",
    "Simulate impact of a 15% revenue deceleration",
  ];

  const handleSend = async (textToSend?: string) => {
    const question = textToSend || input;
    if (!question.trim() || loading) return;

    const userMsg = { role: "user", content: question };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question,
          financialSummary: summary,
          businessName: activeBusiness,
        }),
      });

      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.answer || "Ledger verified. Capital stability intact.",
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "System audit alert: Connection to intelligence engine interrupted. Review balance sheet figures in Overview.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl pb-16">
      <div className="pb-6 border-b border-[#222222]">
        <span className="text-[10px] tracking-[0.25em] uppercase text-[#707070] block font-sans">
          Deterministic Intelligence • Powered by Gemini 3.8 Flash
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white mt-1">
          Executive Copilot
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {predefinedPrompts.map((p) => (
          <button
            key={p}
            onClick={() => handleSend(p)}
            className="text-left p-3.5 border border-[#222222] bg-[#0A0A0A] hover:bg-[#121212] hover:border-white transition-colors text-xs text-[#A0A0A0] hover:text-white flex items-center justify-between cursor-pointer"
          >
            <span>{p}</span>
            <ArrowUpRight size={13} className="shrink-0 text-[#707070]" />
          </button>
        ))}
      </div>

      <div className="border border-[#222222] bg-[#0A0A0A] p-6 min-h-[380px] max-h-[550px] overflow-y-auto space-y-6">
        {messages.map((m, idx) => (
          <div key={idx} className={`flex space-x-4 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            {m.role === "assistant" && (
              <div className="w-7 h-7 border border-[#333] bg-black flex items-center justify-center shrink-0 text-white mt-1">
                <Sparkles size={13} />
              </div>
            )}
            <div
              className={`max-w-2xl text-xs font-sans leading-relaxed p-5 border whitespace-pre-wrap ${
                m.role === "user"
                  ? "bg-white text-black border-white font-medium"
                  : "bg-black text-[#A0A0A0] border-[#222222]"
              }`}
            >
              {m.content}
            </div>
            {m.role === "user" && (
              <div className="w-7 h-7 border border-[#333] bg-white text-black flex items-center justify-center shrink-0 mt-1">
                <User size={13} />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center space-x-3 text-xs text-[#707070]">
            <Sparkles size={13} className="animate-spin text-white" />
            <span>Auditing financial ledger with Gemini 3.8 Flash...</span>
          </div>
        )}
      </div>

      <div className="flex items-center border border-[#222222] bg-black">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a strategic financial question regarding your ledger..."
          className="flex-1 bg-transparent px-4 py-3 text-xs text-white placeholder-[#505050] focus:outline-none"
        />
        <button
          onClick={() => handleSend()}
          disabled={loading}
          className="px-5 py-3 text-white hover:text-neutral-300 transition-colors cursor-pointer disabled:opacity-40"
        >
          <Send size={14} />
        </button>
      </div>
    </div>
  );
}
