"use client";

import React, { useState, useEffect } from "react";
import { getVIPGuestList, toggleGuestSeatedStatus, addLoyaltyPoints, VIPGuestDossier } from "@/app/actions/crm";
import { Users, Star, ShieldAlert, Wine, Award, CheckCircle, Plus, Search, MapPin, Sparkles, AlertTriangle, Phone, Mail, DollarSign } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function VIPGuestCRMPage() {
  const [guests, setGuests] = useState<VIPGuestDossier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedTier, setSelectedTier] = useState<string>("ALL");
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const list = await getVIPGuestList();
    setGuests(list);
    setLoading(false);
  };

  const handleToggleSeated = async (guest: VIPGuestDossier) => {
    const table = guest.isSeatedRightNow ? undefined : prompt("Assign Table Number for VIP Guest:", guest.favoriteTable.split(" ")[0] || "Table 1");
    if (!guest.isSeatedRightNow && !table) return;

    const res = await toggleGuestSeatedStatus(guest.id, table || undefined);
    if (res.success && res.guest) {
      loadData();
      setActionFeedback(
        res.guest.isSeatedRightNow
          ? `🛎️ VIP Alert Fired! ${res.guest.fullName} seated at ${res.guest.currentTableAssigned}. Amuse-bouche & Sommelier alerted!`
          : `${res.guest.fullName} checked out. Loyalty points & spend ledger archived.`
      );
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  const handleAddBonusPoints = async (guest: VIPGuestDossier) => {
    const res = await addLoyaltyPoints(guest.id, 500);
    if (res.success) {
      loadData();
      setActionFeedback(`✨ Awarded +500 Bonus Loyalty Points to ${guest.fullName}! New Balance: ${res.newBalance} pts`);
      setTimeout(() => setActionFeedback(null), 4000);
    }
  };

  const filteredGuests = guests.filter(g => {
    const matchesSearch = g.fullName.toLowerCase().includes(search.toLowerCase()) || g.email.toLowerCase().includes(search.toLowerCase());
    const matchesTier = selectedTier === "ALL" || g.tier === selectedTier;
    return matchesSearch && matchesTier;
  });

  const totalVIPSpend = guests.reduce((acc, g) => acc + g.lifetimeSpendUSD, 0);
  const currentlySeatedCount = guests.filter(g => g.isSeatedRightNow).length;

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7C1D35] rounded-2xl text-[#C9A84C] shadow-lg">
            <Award className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight">
              VIP Guest CRM & Dietary Dossier Vault
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Lifetime Value Tracking (`LTV`) • Sommelier Wine Preferences • Kitchen Dietary Guardrails • Table Alerts
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-[#111111] px-4 py-3 rounded-2xl border border-[#2A1A1F]">
          <div>
            <span className="text-gray-400">Total VIP Portfolio LTV:</span>
            <div className="text-base font-bold text-[#C9A84C]">${totalVIPSpend.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="h-8 w-px bg-[#2A1A1F]" />
          <div>
            <span className="text-gray-400">Currently Seated VIPs:</span>
            <div className={`text-base font-bold flex items-center gap-1 ${currentlySeatedCount > 0 ? "text-emerald-400" : "text-gray-400"}`}>
              <span>{currentlySeatedCount} Guests</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Feedback Banner */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-2xl mb-6 flex items-center justify-between font-bold text-xs shadow-xl"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" /> {actionFeedback}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6 justify-between items-start sm:items-center">
        <div className="relative flex-1 w-full max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Search VIP by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-[#111111] border border-[#2A1A1F] rounded-xl pl-10 pr-4 py-3 text-xs text-white focus:outline-none focus:border-[#C9A84C]"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1">
          {["ALL", "ROYAL_PLATINUM", "BLACK_DIAMOND", "GOLD_AMBASSADOR"].map((tier) => (
            <button
              key={tier}
              onClick={() => setSelectedTier(tier)}
              className={`px-3.5 py-2 rounded-xl font-bold text-xs uppercase tracking-wider font-mono transition ${
                selectedTier === tier
                  ? "bg-[#C9A84C] text-[#0A0A0A] shadow-md scale-105"
                  : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-white"
              }`}
            >
              {tier.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {/* VIP Dossier Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredGuests.map((g) => {
          const isSeated = g.isSeatedRightNow;
          return (
            <div
              key={g.id}
              className={`bg-[#111111] rounded-3xl p-6 shadow-2xl flex flex-col justify-between border-2 transition ${
                isSeated ? "border-emerald-500/70 bg-emerald-950/10 shadow-emerald-900/10" : "border-[#2A1A1F] hover:border-[#C9A84C]/50"
              }`}
            >
              <div>
                {/* Dossier Header */}
                <div className="flex justify-between items-start border-b border-[#2A1A1F] pb-4 mb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded text-[10px] font-mono font-black uppercase tracking-widest ${
                        g.tier === "ROYAL_PLATINUM" ? "bg-[#C9A84C] text-[#0A0A0A]" : "bg-[#7C1D35] text-white"
                      }`}>
                        {g.tier.replace("_", " ")}
                      </span>
                      {isSeated && (
                        <span className="bg-emerald-500 text-black font-extrabold text-[10px] px-2.5 py-0.5 rounded-full animate-pulse flex items-center gap-1">
                          ● SEATED @ {g.currentTableAssigned?.toUpperCase()}
                        </span>
                      )}
                    </div>
                    <h3 className="text-xl font-bold text-white mt-2 flex items-center gap-2">
                      {g.fullName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-1 font-mono">
                      <span className="flex items-center gap-1"><Mail className="w-3 h-3 text-[#C9A84C]" /> {g.email}</span>
                      <span className="flex items-center gap-1"><Phone className="w-3 h-3 text-[#C9A84C]" /> {g.phone}</span>
                    </div>
                  </div>

                  <div className="text-right font-mono">
                    <span className="text-[10px] uppercase text-gray-500 block font-bold">Lifetime Value (LTV):</span>
                    <span className="text-2xl font-black text-[#C9A84C]">${g.lifetimeSpendUSD.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-400 block mt-0.5">{g.totalVisits} Total Visits • {g.loyaltyPointsBalance} pts</span>
                  </div>
                </div>

                {/* Dietary & Allergy Guardrail Box */}
                <div className="p-3.5 rounded-2xl bg-red-950/30 border border-red-500/40 mb-4 space-y-1">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-red-400 uppercase tracking-wide">
                    <ShieldAlert className="w-4 h-4 animate-bounce" /> Kitchen Dietary & Allergy Protocol:
                  </div>
                  <p className="text-xs text-red-200 font-semibold pl-5 leading-relaxed">
                    {g.dietaryAllergyDossier}
                  </p>
                </div>

                {/* Wine Preference & Notes */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4 text-xs">
                  <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5">
                    <span className="text-gray-400 block font-bold uppercase text-[10px] flex items-center gap-1 mb-1">
                      <Wine className="w-3.5 h-3.5 text-[#C9A84C]" /> Sommelier Preference:
                    </span>
                    <p className="text-white font-medium">{g.sommelierWinePreference}</p>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5">
                    <span className="text-gray-400 block font-bold uppercase text-[10px] flex items-center gap-1 mb-1">
                      <MapPin className="w-3.5 h-3.5 text-[#C9A84C]" /> Favorite Table:
                    </span>
                    <p className="text-white font-medium">{g.favoriteTable}</p>
                  </div>
                </div>

                <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5 text-xs">
                  <span className="text-gray-400 font-bold uppercase text-[10px] block mb-1">Special Concierge Notes:</span>
                  <p className="text-gray-300 italic">"{g.specialNotes}"</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 pt-4 border-t border-[#2A1A1F] flex flex-wrap gap-3">
                <button
                  onClick={() => handleToggleSeated(g)}
                  className={`flex-1 py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 shadow-lg ${
                    isSeated
                      ? "bg-[#2A1A1F] hover:bg-red-900/40 text-gray-300 hover:text-white"
                      : "bg-[#7C1D35] text-[#C9A84C] hover:bg-[#9D2442]"
                  }`}
                >
                  {isSeated ? "👋 Checkout & Archiver Shift Record" : "🛎️ Seat VIP & Fire Kitchen Alert"}
                </button>

                <button
                  onClick={() => handleAddBonusPoints(g)}
                  className="px-4 py-3 rounded-xl bg-[#2A1A1F] hover:bg-[#C9A84C] hover:text-[#0A0A0A] text-white font-bold text-xs transition flex items-center gap-1.5"
                  title="Award +500 loyalty points"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C9A84C]" /> +500 Pts
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
