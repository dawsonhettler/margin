"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDown, Building2, User, LogOut, Plus, Search } from "lucide-react";
import { useFinancial } from "@/context/FinancialContext";
import { createClient } from "@/lib/supabase/client";
import { CommandPalette } from "@/components/app/CommandPalette";

export const AppHeader = () => {
  const router = useRouter();
  const { activeBusiness, setActiveBusiness } = useFinancial();
  const [open, setOpen] = useState(false);
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [entityList, setEntityList] = useState<string[]>([
    "Vanguard Studio Inc.",
    "Aethelgard Commerce LLC",
    "Atelier Capital",
  ]);
  const [isCreating, setIsCreating] = useState(false);
  const [newEntityName, setNewEntityName] = useState("");

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsCommandOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

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
        setEntityList(data.map((b: { business_name: string }) => b.business_name));
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
    <>
      <header className="h-16 border-b border-white/[0.08] bg-black/70 backdrop-blur-2xl px-6 flex items-center justify-between sticky top-0 z-40 print:hidden transition-all duration-200">
        <div className="flex items-center space-x-6">
          <Link href="/" className="md:hidden">
            <span className="font-serif tracking-[0.2em] text-lg font-light text-white">MARGIN</span>
          </Link>

          {/* Spatial Glass Entity Switcher */}
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="flex items-center space-x-2 text-xs tracking-widest uppercase text-neutral-200 border border-white/10 bg-white/[0.02] px-3.5 py-1.5 hover:border-white/40 hover:bg-white/[0.06] transition-all cursor-pointer backdrop-blur-md apple-press shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]"
            >
              <Building2 size={13} className="text-[#808080]" />
              <span className="font-medium">{activeBusiness}</span>
              <ChevronDown size={12} className="text-[#808080]" />
            </button>

            {open && (
              <div className="absolute left-0 mt-2 w-64 liquid-glass-elevated py-1.5 z-50 shadow-2xl animate-in fade-in zoom-in-95 duration-150">
                <div className="px-3 py-2 text-[9px] uppercase tracking-widest text-[#707070] border-b border-white/[0.08]">
                  Active Enterprise Entity
                </div>
                {entityList.map((b) => (
                  <button
                    key={b}
                    onClick={() => { setActiveBusiness(b); setOpen(false); }}
                    className={`w-full text-left px-3.5 py-2.5 text-xs transition-colors cursor-pointer ${
                      activeBusiness === b ? "text-white bg-white/10 font-medium" : "text-[#808080] hover:text-white hover:bg-white/[0.05]"
                    }`}
                  >
                    {b}
                  </button>
                ))}

                <div className="border-t border-white/[0.08] p-2">
                  {!isCreating ? (
                    <button
                      onClick={() => setIsCreating(true)}
                      className="flex items-center space-x-1.5 text-[10px] tracking-wider uppercase text-neutral-400 hover:text-white transition-colors w-full px-2 py-1.5"
                    >
                      <Plus size={11} />
                      <span>Create Entity Profile</span>
                    </button>
                  ) : (
                    <form onSubmit={handleCreateEntity} className="space-y-2 p-1">
                      <input
                        type="text"
                        placeholder="Entity name..."
                        value={newEntityName}
                        onChange={(e) => setNewEntityName(e.target.value)}
                        className="w-full bg-black/80 border border-white/20 px-2 py-1 text-xs text-white placeholder-[#505050] focus:outline-none focus:border-white"
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

          {/* Quick Command Bar Trigger */}
          <button
            onClick={() => setIsCommandOpen(true)}
            className="hidden sm:flex items-center space-x-3 text-xs border border-white/10 bg-white/[0.02] hover:bg-white/[0.06] hover:border-white/30 px-3.5 py-1.5 text-[#707070] hover:text-white transition-all cursor-pointer backdrop-blur-md apple-press shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]"
          >
            <Search size={12} />
            <span className="text-[11px] tracking-wider font-light">Command Palette...</span>
            <span className="border border-white/15 bg-white/5 px-1.5 py-0.5 text-[9px] uppercase tracking-widest text-neutral-300">
              ⌘K
            </span>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-5">
          <button
            onClick={handleSignOut}
            className="flex items-center space-x-1.5 text-[11px] uppercase tracking-widest text-[#707070] hover:text-white transition-colors cursor-pointer"
          >
            <LogOut size={12} />
            <span>Sign Out</span>
          </button>
          <div className="w-8 h-8 border border-white/10 bg-white/[0.03] backdrop-blur-md flex items-center justify-center text-[#707070] hover:text-white hover:border-white/40 transition-colors shadow-[inset_0_1px_1px_rgba(255,255,255,0.15)]">
            <User size={14} />
          </div>
        </div>
      </header>

      <CommandPalette isOpen={isCommandOpen} onClose={() => setIsCommandOpen(false)} />
    </>
  );
};

export default AppHeader;
