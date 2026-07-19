"use client";

import React, { useState, useEffect, useMemo } from "react";
import { getLiveMenu } from "@/app/actions/menu";
import { TrendingUp, Award, AlertTriangle, HelpCircle, DollarSign, BarChart3, ArrowUpRight, ArrowDownRight, Sparkles, RefreshCw, Layers } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuEngineeringItem {
  id: string;
  name: string;
  category: string;
  price: number;
  foodCost: number; // Estimated or actual cost
  contributionMargin: number; // price - foodCost
  unitsSold: number; // popularity volume
  totalRevenue: number;
  totalProfit: number;
  quadrant: "STAR" | "PLOWHORSE" | "PUZZLE" | "DOG";
  recommendation: string;
}

export default function AnalyticsAndMenuEngineeringPage() {
  const [items, setItems] = useState<MenuEngineeringItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuadrant, setSelectedQuadrant] = useState<string>("ALL");
  const [simulatedBoost, setSimulatedBoost] = useState<{ [key: string]: number }>({});

  useEffect(() => {
    getLiveMenu().then((liveItems: any[]) => {
      // Enrich with Kasavana-Smith simulated historical sales & cost parameters for BI calculation
      const enriched: MenuEngineeringItem[] = liveItems.map((item, index) => {
        const price = Number(item.price) || 20;
        // Estimate food cost (~28% to 38% depending on category or realistic variance)
        const costRatio = item.category?.name?.includes("Mains") ? 0.35 : item.category?.name?.includes("Beverages") ? 0.18 : 0.28;
        const foodCost = Number((price * costRatio).toFixed(2));
        const contributionMargin = Number((price - foodCost).toFixed(2));
        
        // Generate realistic units sold based on name or index
        const unitsSold = item.name.includes("Ribeye") ? 184 : item.name.includes("Arancini") ? 240 : item.name.includes("Salmon") ? 120 : item.name.includes("Caviar") ? 32 : item.name.includes("Tiramisu") ? 165 : item.name.includes("Barolo") ? 190 : Math.max(25, 140 - index * 12);
        
        const totalRevenue = Number((price * unitsSold).toFixed(2));
        const totalProfit = Number((contributionMargin * unitsSold).toFixed(2));

        // We will compute quadrant after averages
        return {
          id: item.id,
          name: item.name,
          category: item.category?.name || "General",
          price,
          foodCost,
          contributionMargin,
          unitsSold,
          totalRevenue,
          totalProfit,
          quadrant: "STAR",
          recommendation: ""
        };
      });

      // Compute Kasavana-Smith Thresholds
      if (enriched.length > 0) {
        const avgMargin = enriched.reduce((acc, i) => acc + i.contributionMargin, 0) / enriched.length;
        const totalUnits = enriched.reduce((acc, i) => acc + i.unitsSold, 0);
        // Popularity benchmark index = (1 / N) * 0.70 of total mix share
        const avgShare = (1 / enriched.length) * 0.70;

        const classified = enriched.map(i => {
          const itemShare = i.unitsSold / totalUnits;
          const isHighMargin = i.contributionMargin >= avgMargin;
          const isHighPop = itemShare >= avgShare;

          let quadrant: MenuEngineeringItem["quadrant"] = "STAR";
          let recommendation = "";

          if (isHighMargin && isHighPop) {
            quadrant = "STAR";
            recommendation = "Maintain flawless consistency & feature prominently on top menu positions.";
          } else if (!isHighMargin && isHighPop) {
            quadrant = "PLOWHORSE";
            recommendation = `Increase price by $${Math.ceil(i.price * 0.12)}.00 or slightly adjust portion size to boost margin without killing volume.`;
          } else if (isHighMargin && !isHighPop) {
            quadrant = "PUZZLE";
            recommendation = "High profit ($" + i.contributionMargin + "/order). Have waitstaff actively upsell, add chef's icon, or rename description.";
          } else {
            quadrant = "DOG";
            recommendation = "Consider removing from next menu overhaul or re-engineering recipe entirely.";
          }

          return { ...i, quadrant, recommendation };
        });

        setItems(classified);
      }
      setLoading(false);
    });
  }, []);

  const averages = useMemo(() => {
    if (items.length === 0) return { margin: 0, units: 0, totalRev: 0, totalProf: 0 };
    const totalRev = items.reduce((acc, i) => acc + i.totalRevenue, 0);
    const totalProf = items.reduce((acc, i) => acc + i.totalProfit, 0);
    const avgMargin = items.reduce((acc, i) => acc + i.contributionMargin, 0) / items.length;
    const avgUnits = items.reduce((acc, i) => acc + i.unitsSold, 0) / items.length;
    return { margin: avgMargin.toFixed(2), units: Math.round(avgUnits), totalRev: totalRev.toFixed(2), totalProf: totalProf.toFixed(2) };
  }, [items]);

  const filteredItems = useMemo(() => {
    if (selectedQuadrant === "ALL") return items;
    return items.filter(i => i.quadrant === selectedQuadrant);
  }, [items, selectedQuadrant]);

  const counts = useMemo(() => {
    return {
      STAR: items.filter(i => i.quadrant === "STAR").length,
      PLOWHORSE: items.filter(i => i.quadrant === "PLOWHORSE").length,
      PUZZLE: items.filter(i => i.quadrant === "PUZZLE").length,
      DOG: items.filter(i => i.quadrant === "DOG").length,
    };
  }, [items]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#7C1D35] rounded-xl text-[#F5F0E8] shadow-lg">
              <BarChart3 className="w-8 h-8 text-[#C9A84C]" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight">
                Kasavana-Smith Menu Engineering BI
              </h1>
              <p className="text-sm text-gray-400 mt-0.5">
                Strategic Contribution Margin ($) vs. Volume Popularity Matrix • Algorithmic Pricing Recommendations
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-[#111111] px-4 py-3 rounded-2xl border border-[#2A1A1F]">
          <div>
            <span className="text-gray-400">Total Analyzed Revenue:</span>
            <div className="text-base font-bold text-white">${averages.totalRev}</div>
          </div>
          <div className="h-8 w-px bg-[#2A1A1F]" />
          <div>
            <span className="text-gray-400">Total Gross Profit:</span>
            <div className="text-base font-bold text-emerald-400">${averages.totalProf}</div>
          </div>
          <div className="h-8 w-px bg-[#2A1A1F]" />
          <div>
            <span className="text-gray-400">Benchmark Margin:</span>
            <div className="text-base font-bold text-[#C9A84C]">${averages.margin}/dish</div>
          </div>
        </div>
      </div>

      {/* Quadrant Filter Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {[
          {
            id: "STAR",
            label: "⭐ Stars (High Profit / High Vol)",
            desc: "Signature workhorses driving revenue and brand loyalty.",
            count: counts.STAR,
            color: "border-emerald-500/50 bg-emerald-500/10 text-emerald-400",
            activeBorder: "border-emerald-400 ring-2 ring-emerald-400/30"
          },
          {
            id: "PLOWHORSE",
            label: "🐴 Plowhorses (Low Profit / High Vol)",
            desc: "Guest favorites with squeezed contribution margins.",
            count: counts.PLOWHORSE,
            color: "border-amber-500/50 bg-amber-500/10 text-amber-300",
            activeBorder: "border-amber-400 ring-2 ring-amber-400/30"
          },
          {
            id: "PUZZLE",
            label: "🧩 Puzzles (High Profit / Low Vol)",
            desc: "High-yield dishes needing aggressive marketing and upselling.",
            count: counts.PUZZLE,
            color: "border-blue-500/50 bg-blue-500/10 text-blue-300",
            activeBorder: "border-blue-400 ring-2 ring-blue-400/30"
          },
          {
            id: "DOG",
            label: "🐶 Dogs (Low Profit / Low Vol)",
            desc: "Underperformers dragging down kitchen prep efficiency.",
            count: counts.DOG,
            color: "border-red-500/50 bg-red-500/10 text-red-400",
            activeBorder: "border-red-400 ring-2 ring-red-400/30"
          }
        ].map((quad) => (
          <button
            key={quad.id}
            onClick={() => setSelectedQuadrant(selectedQuadrant === quad.id ? "ALL" : quad.id)}
            className={`p-5 rounded-3xl border text-left transition-all relative overflow-hidden flex flex-col justify-between ${quad.color} ${
              selectedQuadrant === quad.id ? quad.activeBorder + " scale-[1.02] shadow-xl" : "hover:border-opacity-100 opacity-90"
            }`}
          >
            <div>
              <div className="flex justify-between items-start mb-2">
                <span className="font-extrabold text-sm sm:text-base">{quad.label}</span>
                <span className="text-xl font-black px-2.5 py-0.5 rounded-full bg-black/40 border border-white/10">{quad.count}</span>
              </div>
              <p className="text-xs opacity-80 leading-relaxed">{quad.desc}</p>
            </div>
            {selectedQuadrant === quad.id && (
              <div className="mt-3 text-[10px] uppercase font-mono tracking-widest font-bold text-white bg-black/50 py-1 px-2.5 rounded-lg w-max">
                ✓ Filter Applied
              </div>
            )}
          </button>
        ))}
      </div>

      {/* Kasavana-Smith Matrix Table */}
      <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-2xl overflow-x-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b border-[#2A1A1F]">
          <h2 className="text-xl font-bold text-[#F5F0E8] flex items-center gap-2">
            <Layers className="w-5 h-5 text-[#C9A84C]" />
            {selectedQuadrant === "ALL" ? "All Analyzed Dishes (Full Menu Mix)" : `Filtered Quadrant: ${selectedQuadrant}`}
          </h2>
          <button
            onClick={() => setSelectedQuadrant("ALL")}
            className="text-xs font-bold text-gray-400 hover:text-[#C9A84C] transition"
          >
            Reset Filters ({items.length} Items)
          </button>
        </div>

        {loading ? (
          <div className="py-20 text-center text-gray-500 flex flex-col items-center gap-3">
            <RefreshCw className="w-8 h-8 animate-spin text-[#C9A84C]" />
            <span>Calculating Kasavana-Smith mix indices and contribution margins...</span>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A1A1F] text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                <th className="py-3.5 px-4">Menu Dish</th>
                <th className="py-3.5 px-4">Price / Cost</th>
                <th className="py-3.5 px-4">Contribution Margin ($)</th>
                <th className="py-3.5 px-4">Units Sold (Vol)</th>
                <th className="py-3.5 px-4">Total Profit</th>
                <th className="py-3.5 px-4">Quadrant</th>
                <th className="py-3.5 px-4">AI Action Plan & Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1A1F] text-sm">
              {filteredItems.map((item) => (
                <tr key={item.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-4 font-bold text-white">
                    <div>{item.name}</div>
                    <span className="text-xs font-mono text-gray-500">{item.category}</span>
                  </td>
                  <td className="py-4 px-4 font-mono text-xs">
                    <div className="text-white">${item.price.toFixed(2)}</div>
                    <div className="text-gray-500">Cost: ${item.foodCost.toFixed(2)}</div>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className={`px-2.5 py-1 rounded-lg font-bold text-xs ${
                      item.contributionMargin >= Number(averages.margin)
                        ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                        : "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    }`}>
                      +${item.contributionMargin.toFixed(2)}
                    </span>
                  </td>
                  <td className="py-4 px-4 font-mono">
                    <span className="font-bold text-white">{item.unitsSold}</span>
                    <span className="text-[10px] text-gray-500 ml-1">orders</span>
                  </td>
                  <td className="py-4 px-4 font-mono font-bold text-[#C9A84C]">
                    ${item.totalProfit.toFixed(2)}
                  </td>
                  <td className="py-4 px-4">
                    {item.quadrant === "STAR" && <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">⭐ Star</span>}
                    {item.quadrant === "PLOWHORSE" && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">🐴 Plowhorse</span>}
                    {item.quadrant === "PUZZLE" && <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-500/20 text-blue-300 border border-blue-500/40">🧩 Puzzle</span>}
                    {item.quadrant === "DOG" && <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40">🐶 Dog</span>}
                  </td>
                  <td className="py-4 px-4 text-xs text-gray-300 max-w-sm leading-relaxed">
                    <div className="flex items-start gap-2">
                      <Sparkles className="w-4 h-4 text-[#C9A84C] flex-shrink-0 mt-0.5" />
                      <span>{item.recommendation}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
