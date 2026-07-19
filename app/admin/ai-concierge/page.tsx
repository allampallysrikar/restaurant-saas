"use client";

import React, { useState } from "react";
import { Sparkles, Wine, ShieldCheck, MessageSquare, Save, CheckCircle, Sliders, RefreshCw, Bot, AlertTriangle, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AiConciergeAdminPage() {
  const [tone, setTone] = useState<"MICHELIN_SOMMELIER" | "CASUAL_WARM" | "STRICT_ALLERGY_FIRST">("MICHELIN_SOMMELIER");
  const [customPromptRules, setCustomPromptRules] = useState(
    `You are the Head Sommelier & Dietary Concierge at The Golden Fork, an award-winning fine dining luxury establishment.
Always maintain an elegant, sophisticated, and inviting tone.
Prioritize absolute accuracy regarding nut, dairy, and gluten allergens using live kitchen prep protocols.
Suggest high-margin wine pairings (e.g., Barolo D.O.C.G. or French Burgundy) when guests ask about Wagyu beef or truffle dishes.`
  );
  const [pairingOverrides, setPairingOverrides] = useState([
    { dish: "Wagyu Ribeye Steak A5", wine: "2018 Barolo D.O.C.G. Piedmont ($28/glass)" },
    { dish: "Black Truffle Arancini", wine: "Franciacorta Brut Sparkling Wine ($22/glass)" },
    { dish: "Royal Osetra Caviar", wine: "Dom Pérignon Vintage Champagne ($95/glass)" },
    { dish: "Pan-Seared Scottish King Salmon", wine: "Sancerre White Loire Valley ($24/glass)" },
  ]);
  const [savedToast, setSavedToast] = useState(false);

  const handleSave = () => {
    setSavedToast(true);
    setTimeout(() => setSavedToast(false), 4000);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7C1D35] rounded-2xl text-[#C9A84C] shadow-lg">
            <Bot className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight">
              AI Sommelier & Concierge Control Center
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Customize AI System Prompt Rules • Wine Pairing Guardrails • Dietary Safety Protocols
            </p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-6 py-3.5 rounded-2xl bg-[#C9A84C] text-[#0A0A0A] font-black text-sm hover:bg-white transition flex items-center gap-2 shadow-2xl"
        >
          <Save className="w-4 h-4" /> Save & Deploy AI Rules Live
        </button>
      </div>

      {/* Toast */}
      <AnimatePresence>
        {savedToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-2xl mb-6 flex items-center justify-between font-bold text-xs"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> AI Sommelier rules & wine pairing guardrails deployed across customer menu & table QR portals!
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Tone & Prompt Rules */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Sliders className="w-5 h-5 text-[#C9A84C]" /> AI Persona & Tone of Voice
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {[
                { id: "MICHELIN_SOMMELIER", label: "Michelin Sommelier", desc: "Refined, eloquent wine notes & luxury dining etiquette." },
                { id: "CASUAL_WARM", label: "Warm & Conversational", desc: "Friendly, accessible explanations of dishes & drinks." },
                { id: "STRICT_ALLERGY_FIRST", label: "Dietary Safety First", desc: "Rigorous focus on ingredients, prep safety & dietary labels." }
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTone(t.id as any)}
                  className={`p-4 rounded-2xl border text-left transition ${
                    tone === t.id
                      ? "bg-[#7C1D35]/30 border-[#C9A84C] text-white shadow-lg scale-[1.02]"
                      : "bg-[#0A0A0A] border-[#2A1A1F] text-gray-400 hover:text-white hover:border-[#C9A84C]/40"
                  }`}
                >
                  <div className="font-bold text-sm text-[#C9A84C] flex items-center justify-between">
                    <span>{t.label}</span>
                    {tone === t.id && <Check className="w-4 h-4" />}
                  </div>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{t.desc}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#C9A84C]" /> Master AI System Prompt Rules
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              These system instructions govern how the AI Concierge answers customer questions, recommends pairings, and cross-sells high-margin menu items.
            </p>

            <textarea
              value={customPromptRules}
              onChange={(e) => setCustomPromptRules(e.target.value)}
              className="w-full bg-[#0A0A0A] border border-[#2A1A1F] rounded-2xl p-4 text-xs font-mono text-gray-200 resize-none h-44 focus:outline-none focus:border-[#C9A84C]"
            />
          </div>
        </div>

        {/* Right Col: Wine Pairing Guardrails */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl">
            <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
              <Wine className="w-5 h-5 text-[#C9A84C]" /> Sommelier Pairing Guardrails
            </h2>
            <p className="text-xs text-gray-400 mb-4">
              Enforce exact wine recommendations whenever a guest inquires about these specific signature dishes.
            </p>

            <div className="space-y-3">
              {pairingOverrides.map((p, idx) => (
                <div key={idx} className="p-3.5 bg-[#0A0A0A] border border-white/5 rounded-2xl space-y-1 text-xs">
                  <span className="font-bold text-white block">Dish: {p.dish}</span>
                  <span className="text-[#C9A84C] font-mono block">Enforced Wine: {p.wine}</span>
                </div>
              ))}
            </div>

            <button
              onClick={() => {
                const dish = prompt("Enter Dish Name:");
                const wine = prompt("Enter Enforced Wine Pairing:");
                if (dish && wine) {
                  setPairingOverrides([...pairingOverrides, { dish, wine }]);
                }
              }}
              className="w-full py-3 mt-4 rounded-xl bg-[#2A1A1F] hover:bg-[#7C1D35] text-white font-bold text-xs transition"
            >
              + Add Custom Wine Override
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
