"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Building2, User, LogOut, Plus } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { createClient } from "@/lib/supabase/client";

export const AppHeader = () => {
  const router = useRouter();
  const { activeBusiness, setActiveBusiness } = useFinancial();
  const [open, setOpen] = useState(false);
  const [entityList, setEntityList] = useState<string[]>(["Vanguard Studio Inc.", "Aethelgard Commerce LLC", "Atelier Capital"]);
  const [isCreating, setIsCreating] = useState(false);
  const [newEntityName, setNewEntityName] = useState("");

  useEffect(() => {
    async function loadEntities() {
      const supabase = createClient();
      if (!supabase) return;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data } = await supabase
        .from("businesses")
        .select("business_name")
        .eq("owner_id", user.id);

      if (data && data.length > 0) {
        setEntityList(data.map((b) => b.business_name));
      }
    }
    loadEntities();
  }, []);

  const handleSignOut = async () => {
    const supabase = createClient();
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push("/auth/login");
  };

  const handleCreateEntity = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEntityName.trim()) return;

    const supabase = createClient();
    if (supabase) {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("businesses").insert({
          owner_id: user.id,
          business_name: newEntityName,
          currency: "USD",
        });
      }
    }

    setEntityList((prev) => [...prev, newEntityName]);
    setActiveBusiness(newEntityName);
    setNewEntityName("");
    setIsCreating(false);
    setOpen(false);
  };

  return (
    <header className="h-16 border-b border-[#222222] bg-black px-6 flex items-center justify-between sticky top-0 z-40 print:hidden">
      <div className="flex items-center space-x-6">
        <Link href="/" className="md:hidden">
          <span className="font-serif tracking-[0.2em] text-lg font-light text-white">MARGIN</span>
        </Link>
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center space-x-2 text-xs tracking-widest uppercase text-neutral-200 border border-[#222222] px-3 py-1.5 hover:border-white transition-colors cursor-pointer"
          >
            <Building2 size={13} className="text-[#707070]" />
            <span>{activeBusiness}</span>
            <ChevronDown size={12} className="text-[#707070]" />
          </button>

          {open && (
            <div className="absolute left-0 mt-1 w-64 bg-[#0A0A0A] border border-[#222222] py-1 z-50 shadow-2xl">
              <div className="px-3 py-2 text-[9px] uppercase tracking-widest text-[#707070] border-b border-[#222222]">
                Active Enterprise Entity
              </div>
              {entityList.map((b) => (
                <button
                  key={b}
                  onClick={() => { setActiveBusiness(b); setOpen(false); }}
                  className={`w-full text-left px-3 py-2 text-xs transition-colors cursor-pointer ${
                    activeBusiness === b ? "text-white bg-[#121212] font-medium" : "text-[#707070] hover:text-white"
                  }`}
                >
                  {b}
                </button>
              ))}

              <div className="border-t border-[#222222] p-2">
                {!isCreating ? (
                  <button
                    onClick={() => setIsCreating(true)}
                    className="flex items-center space-x-1.5 text-[10px] tracking-wider uppercase text-neutral-400 hover:text-white transition-colors w-full px-2 py-1"
                  >
                    <Plus size={11} />
                    <span>Create Entity Profile</span>
                  </button>
                ) : (
                  <form onSubmit={handleCreateEntity} className="space-y-2">
                    <input
                      type="text"
                      placeholder="Entity name..."
                      value={newEntityName}
                      onChange={(e) => setNewEntityName(e.target.value)}
                      className="w-full bg-black border border-[#222222] px-2 py-1 text-xs text-white placeholder-[#505050] focus:outline-none"
                      autoFocus
                    />
                    <div className="flex space-x-1">
                      <button
                        type="submit"
                        className="bg-white text-black px-2 py-1 text-[9px] uppercase tracking-widest font-medium"
                      >
                        Save
                      </button>
                      <button
                        type="button"
                        onClick={() => setIsCreating(false)}
                        className="text-[#707070] px-2 py-1 text-[9px] uppercase tracking-widest"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-5">
        <button
          onClick={handleSignOut}
          className="flex items-center space-x-1.5 text-[11px] uppercase tracking-widest text-[#707070] hover:text-white transition-colors cursor-pointer"
        >
          <LogOut size={12} />
          <span>Sign Out</span>
        </button>
        <div className="w-8 h-8 border border-[#222222] flex items-center justify-center text-[#707070] hover:text-white hover:border-white transition-colors">
          <User size={14} />
        </div>
      </div>
    </header>
  );
};
