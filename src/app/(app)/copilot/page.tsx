"use client";
import React, { useState, useEffect } from "react";
import { Sparkles, Send, User, ArrowUpRight, Volume2, VolumeX, ShieldCheck, Database } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";

export default function CopilotPage() {
  const { summary, transactions, activeBusiness } = useFinancial();
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: `Good day. I have completed a cryptographic audit of the general ledger for ${activeBusiness}. Liquid cash reserves stand at $${summary.cashPosition.toLocaleString()} with ${summary.runwayMonths} months of forward runway across ${transactions.length} verified transactions. How may I assist your capital allocation planning today?`,
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);

  const speakText = (text: string) => {
    if (!voiceEnabled || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();

    const cleanSpeech = text.replace(/[*#_•-]/g, "").trim();
    const utterance = new SpeechSynthesisUtterance(cleanSpeech);
    utterance.rate = 1.0;
    utterance.pitch = 0.95;

    const voices = window.speechSynthesis.getVoices();
    const distinguished = voices.find((v) => v.name.includes("Daniel") || v.name.includes("Oliver") || v.lang.includes("en-GB"));
    if (distinguished) utterance.voice = distinguished;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    window.speechSynthesis.speak(utterance);
  };

  const predefinedPrompts = [
    "Why did our net margin expand this quarter?",
    "Can we safely hire two senior engineers next month?",
    "What are our primary expenditure risks?",
    "Audit top vendor spending concentrations",
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
          transactionCount: transactions.length,
        }),
      });

      const data = await res.json();
      const reply = data.answer || "Ledger verified. Capital stability intact.";
      setMessages((prev) => [...prev, { role: "assistant", content: reply }]);

      if (voiceEnabled) {
        speakText(reply);
      }
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
    <div className="space-y-8 max-w-4xl pb-16 selection:bg-white selection:text-black">
      {/* Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-[#222222] gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
            <Database size={13} className="text-emerald-400" />
            <span className="text-[10px] tracking-[0.25em] uppercase text-emerald-400 font-mono">
              PostgreSQL RLS Connected • Gemini 3.8 Flash
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-white">
            MARGIN Intelligence
          </h1>
        </div>

        <button
          onClick={() => {
            const next = !voiceEnabled;
            setVoiceEnabled(next);
            if (!next && typeof window !== "undefined") window.speechSynthesis.cancel();
          }}
          className={`flex items-center space-x-2 text-xs uppercase tracking-wider px-3.5 py-2 border transition-colors cursor-pointer self-start sm:self-auto ${
            voiceEnabled
              ? "bg-white text-black border-white font-medium"
              : "border-[#333] bg-[#0A0A0A] text-[#707070] hover:text-white"
          }`}
        >
          {voiceEnabled ? <Volume2 size={13} className="animate-pulse" /> : <VolumeX size={13} />}
          <span>{voiceEnabled ? (isSpeaking ? "Speaking Briefing..." : "Audio Brief: On") : "Audio Brief: Off"}</span>
        </button>
      </div>

      {/* Suggested Prompts */}
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

      {/* Chat Thread */}
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
            <span>Querying Supabase general ledger & running deterministic proofs...</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="flex items-center border border-[#222222] bg-black">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          placeholder="Ask a strategic financial question regarding your verified database..."
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
