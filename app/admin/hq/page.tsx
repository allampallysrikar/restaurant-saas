"use client";

import React, { useState, useEffect } from "react";
import { getHQBranches, setActiveBranchScope, getConsolidatedGlobalHQMetrics, BranchStatus } from "@/app/actions/hq";
import { Building2, Globe, TrendingUp, Users, DollarSign, CheckCircle, AlertTriangle, RefreshCw, Download, ArrowUpRight, ShieldAlert, Sparkles, MapPin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HQMultiBranchPage() {
  const [branches, setBranches] = useState<BranchStatus[]>([]);
  const [activeBranchId, setActiveBranchId] = useState<string>("branch-1");
  const [consolidated, setConsolidated] = useState<{
    totalNormalizedUSDRevenue: number;
    totalOrders: number;
    avgLaborPct: number;
    avgFoodCostPct: number;
    totalActiveTables: number;
    totalCapacityTables: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [scopeSuccessToast, setScopeSuccessToast] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [branchData, consData] = await Promise.all([
      getHQBranches(),
      getConsolidatedGlobalHQMetrics()
    ]);
    setBranches(branchData.branches);
    setActiveBranchId(branchData.activeBranchId);
    setConsolidated(consData);
    setLoading(false);
  };

  const handleScopeChange = async (branch: BranchStatus) => {
    const res = await setActiveBranchScope(branch.id);
    if (res.success) {
      setActiveBranchId(branch.id);
      setScopeSuccessToast(`Admin scoped to ${branch.name} (${branch.code})`);
      setTimeout(() => setScopeSuccessToast(null), 4000);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7C1D35] rounded-2xl text-[#C9A84C] shadow-lg">
            <Globe className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight flex items-center gap-2">
              Corporate Headquarters (`HQ`) Multi-Branch Command
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Consolidated Global Telemetry • Localized Currency Normalization • Active Organization Branch Scoping
            </p>
          </div>
        </div>

        <button
          onClick={() => window.print()}
          className="px-6 py-3.5 rounded-2xl bg-[#C9A84C] text-[#0A0A0A] font-black text-sm hover:bg-white transition flex items-center gap-2 shadow-2xl"
        >
          <Download className="w-4 h-4" /> Download Consolidated HQ Report (PDF)
        </button>
      </div>

      {/* Scope Toast */}
      <AnimatePresence>
        {scopeSuccessToast && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-2xl mb-6 flex items-center justify-between font-bold text-xs"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" /> {scopeSuccessToast}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Consolidated Global KPI Banner */}
      {consolidated && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-[#111111] border border-[#C9A84C]/50 rounded-3xl p-5 shadow-xl flex flex-col justify-between">
            <span className="text-xs uppercase font-mono font-bold text-gray-400">Consolidated Global Revenue (USD)</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-[#C9A84C]">${consolidated.totalNormalizedUSDRevenue.toLocaleString()}</span>
              <span className="text-xs font-bold text-emerald-400 flex items-center gap-0.5"><ArrowUpRight className="w-3.5 h-3.5" /> +14.2%</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-mono">Roll-up across 5 international branches</span>
          </div>

          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-5 shadow-xl flex flex-col justify-between">
            <span className="text-xs uppercase font-mono font-bold text-gray-400">Total Global Covers & Orders</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-white">{consolidated.totalOrders}</span>
              <span className="text-xs font-mono text-gray-400">Orders Today</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-mono">{consolidated.totalActiveTables} / {consolidated.totalCapacityTables} Total Active Tables</span>
          </div>

          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-5 shadow-xl flex flex-col justify-between">
            <span className="text-xs uppercase font-mono font-bold text-gray-400">Avg Global Labor Cost %</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-emerald-400">{consolidated.avgLaborPct}%</span>
              <span className="text-xs font-mono text-gray-400">Target: &lt;26%</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-mono">Weighted by revenue volume</span>
          </div>

          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-5 shadow-xl flex flex-col justify-between">
            <span className="text-xs uppercase font-mono font-bold text-gray-400">Avg Global Food Cost %</span>
            <div className="flex items-baseline justify-between mt-2">
              <span className="text-3xl font-black text-amber-400">{consolidated.avgFoodCostPct}%</span>
              <span className="text-xs font-mono text-gray-400">Target: &lt;30%</span>
            </div>
            <span className="text-[10px] text-gray-500 mt-1 font-mono">Includes Wagyu, Truffles & Caviar</span>
          </div>
        </div>
      )}

      {/* Side-by-Side Branch Comparison Grid */}
      <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
        <Building2 className="w-5 h-5 text-[#C9A84C]" /> International Branch Performance Ledger ({branches.length} Locations)
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
        {branches.map((b) => {
          const isScoped = b.id === activeBranchId;
          return (
            <div
              key={b.id}
              className={`bg-[#111111] rounded-3xl p-6 shadow-xl flex flex-col justify-between border-2 transition ${
                isScoped ? "border-[#C9A84C] bg-white/[0.02]" : "border-[#2A1A1F] hover:border-[#C9A84C]/40"
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-4 pb-3 border-b border-[#2A1A1F]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-mono font-black uppercase tracking-wider px-2 py-0.5 rounded bg-[#2A1A1F] text-[#C9A84C]">
                        {b.code}
                      </span>
                      {isScoped && (
                        <span className="bg-emerald-500 text-black text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse">
                          ● ACTIVE SCOPE
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-white mt-1.5">{b.name}</h3>
                    <p className="text-xs text-gray-400 flex items-center gap-1 mt-0.5">
                      <MapPin className="w-3.5 h-3.5 text-gray-500" /> {b.city} • Manager: <span className="text-gray-300 font-semibold">{b.managerOnDuty}</span>
                    </p>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold font-mono ${
                    b.status === "BUSY" ? "bg-amber-500/20 text-amber-300 border border-amber-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  }`}>
                    {b.status}
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-3 my-4 text-xs font-mono">
                  <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5">
                    <span className="text-gray-500 block uppercase font-bold text-[10px]">Daily Revenue ({b.currency}):</span>
                    <span className="text-lg font-black text-[#C9A84C] mt-0.5 block">{b.currencySymbol}{b.dailyRevenue.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5">
                    <span className="text-gray-500 block uppercase font-bold text-[10px]">Avg Ticket Size:</span>
                    <span className="text-lg font-black text-white mt-0.5 block">{b.currencySymbol}{b.avgTicketSize.toLocaleString()}</span>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5">
                    <span className="text-gray-500 block uppercase font-bold text-[10px]">Labor Cost %:</span>
                    <span className={`text-base font-bold mt-0.5 block ${b.laborCostPct > 26 ? "text-amber-400" : "text-emerald-400"}`}>{b.laborCostPct}%</span>
                  </div>
                  <div className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5">
                    <span className="text-gray-500 block uppercase font-bold text-[10px]">Food Cost %:</span>
                    <span className={`text-base font-bold mt-0.5 block ${b.foodCostPct > 30 ? "text-red-400" : "text-gray-300"}`}>{b.foodCostPct}%</span>
                  </div>
                </div>

                <div className="flex justify-between items-center text-xs text-gray-400 font-mono py-2 px-1">
                  <span>Table Turn Rate: <span className="text-white font-bold">{b.tableTurnRate}x</span></span>
                  <span>Capacity: <span className="text-white font-bold">{b.activeTables}/{b.totalTables}</span> Seated</span>
                </div>
              </div>

              {/* Action Button */}
              <div className="mt-4 pt-3 border-t border-[#2A1A1F]">
                <button
                  onClick={() => handleScopeChange(b)}
                  disabled={isScoped}
                  className={`w-full py-3 rounded-xl font-bold text-xs transition flex items-center justify-center gap-2 ${
                    isScoped
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 cursor-default"
                      : "bg-[#7C1D35] text-[#C9A84C] hover:bg-[#9D2442] shadow-lg"
                  }`}
                >
                  {isScoped ? (
                    <>
                      <CheckCircle className="w-4 h-4" /> Current Active Scoped Branch
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-4 h-4" /> Scope Admin Dashboard to this Branch
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
