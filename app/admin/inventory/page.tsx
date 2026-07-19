"use client";

import React, { useState, useEffect } from "react";
import { getInventoryStatus, getRecipeBOMList, restockIngredient, RawIngredient, RecipeBOMItem } from "@/app/actions/inventory";
import { Boxes, AlertTriangle, CheckCircle, FileText, Plus, RefreshCw, Layers, DollarSign, Truck, Mail, Download, ArrowUpRight, ShieldAlert, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function InventoryAndProcurementPage() {
  const [ingredients, setIngredients] = useState<RawIngredient[]>([]);
  const [bomList, setBomList] = useState<RecipeBOMItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"STOCK" | "BOM" | "PO">("STOCK");
  
  // Restock Modal
  const [restockModalItem, setRestockModalItem] = useState<RawIngredient | null>(null);
  const [restockAmount, setRestockAmount] = useState(5);
  const [isRestocking, setIsRestocking] = useState(false);

  // Purchase Order Generator State
  const [generatedPO, setGeneratedPO] = useState<{
    poNumber: string;
    date: string;
    vendor: string;
    items: { name: string; needed: number; unit: string; unitCost: number; totalCost: number }[];
    totalCost: number;
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const [ing, bom] = await Promise.all([getInventoryStatus(), getRecipeBOMList()]);
    setIngredients(ing);
    setBomList(bom);
    setLoading(false);
  };

  const handleRestockSubmit = async () => {
    if (!restockModalItem) return;
    setIsRestocking(true);
    const res = await restockIngredient(restockModalItem.id, restockAmount);
    setIsRestocking(false);
    if (res.success) {
      setRestockModalItem(null);
      loadData();
    }
  };

  const criticalItems = ingredients.filter(i => i.currentStock < i.parLevel);
  const totalInventoryValue = ingredients.reduce((acc, i) => acc + (i.currentStock * i.unitCost), 0);

  const generateAutoPO = (vendorName?: string) => {
    const itemsToOrder = criticalItems
      .filter(i => !vendorName || i.vendor === vendorName)
      .map(i => {
        const needed = Math.ceil(i.parLevel - i.currentStock + (i.parLevel * 0.5)); // Par + 50% buffer
        return {
          name: i.name,
          needed,
          unit: i.unit,
          unitCost: i.unitCost,
          totalCost: Number((needed * i.unitCost).toFixed(2))
        };
      });

    if (itemsToOrder.length === 0) {
      alert("No items below par level for this selection!");
      return;
    }

    const total = itemsToOrder.reduce((acc, i) => acc + i.totalCost, 0);
    setGeneratedPO({
      poNumber: `PO-GF-${Date.now().toString().slice(-6)}`,
      date: new Date().toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' }),
      vendor: vendorName || "Prime Purveyors & European Imports (Combined)",
      items: itemsToOrder,
      totalCost: total
    });
    setActiveTab("PO");
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7C1D35] rounded-2xl text-[#C9A84C] shadow-lg">
            <Boxes className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight">
              Enterprise Inventory & Recipe Procurement
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Automated Par Level Alerts • Recipe Bill of Materials (`BOM`) Deducts • 1-Click Purchase Order (`PO`) Generator
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-[#111111] px-4 py-3 rounded-2xl border border-[#2A1A1F]">
          <div>
            <span className="text-gray-400">Stock Valuation:</span>
            <div className="text-base font-bold text-emerald-400">${totalInventoryValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
          </div>
          <div className="h-8 w-px bg-[#2A1A1F]" />
          <div>
            <span className="text-gray-400">Critical Low Par Alerts:</span>
            <div className={`text-base font-bold flex items-center gap-1 ${criticalItems.length > 0 ? "text-red-400" : "text-emerald-400"}`}>
              {criticalItems.length > 0 && <AlertTriangle className="w-4 h-4 animate-bounce" />}
              <span>{criticalItems.length} Ingredients</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveTab("STOCK")}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition ${
            activeTab === "STOCK"
              ? "bg-[#C9A84C] text-[#0A0A0A] shadow-xl"
              : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-white"
          }`}
        >
          <Boxes className="w-4 h-4" /> Raw Ingredient Stock Table ({ingredients.length})
        </button>
        <button
          onClick={() => setActiveTab("BOM")}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition ${
            activeTab === "BOM"
              ? "bg-[#C9A84C] text-[#0A0A0A] shadow-xl"
              : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-white"
          }`}
        >
          <Layers className="w-4 h-4" /> Recipe Bill of Materials (`BOM`) Mapping ({bomList.length})
        </button>
        <button
          onClick={() => {
            if (!generatedPO) generateAutoPO();
            else setActiveTab("PO");
          }}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition relative ${
            activeTab === "PO"
              ? "bg-[#7C1D35] text-[#C9A84C] border border-[#C9A84C] shadow-xl"
              : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-white"
          }`}
        >
          <FileText className="w-4 h-4 text-[#C9A84C]" /> Automated PO Generator
          {criticalItems.length > 0 && (
            <span className="bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full font-black animate-pulse">
              {criticalItems.length} Low
            </span>
          )}
        </button>
      </div>

      {/* Critical Par Level Banner */}
      {criticalItems.length > 0 && activeTab === "STOCK" && (
        <div className="p-4 bg-red-950/40 border border-red-500/50 rounded-3xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-xl">
          <div className="flex items-start gap-3">
            <div className="p-2.5 bg-red-500 text-black rounded-xl font-bold mt-0.5">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h3 className="font-bold text-white text-base">Critical Par Level Alerts Triggered</h3>
              <p className="text-xs text-red-200 mt-0.5">
                The following ingredients are operating below minimum safety stock:{" "}
                <span className="font-mono font-bold text-amber-300">
                  {criticalItems.map(i => `${i.name} (${i.currentStock}/${i.parLevel} ${i.unit})`).join(", ")}
                </span>
              </p>
            </div>
          </div>
          <button
            onClick={() => generateAutoPO()}
            className="px-5 py-3 rounded-xl bg-red-500 hover:bg-red-400 text-black font-black text-xs transition whitespace-nowrap flex items-center gap-2 shadow-lg"
          >
            <Sparkles className="w-4 h-4" /> Auto-Generate Restock PO Now
          </button>
        </div>
      )}

      {/* TAB 1: RAW INGREDIENT STOCK TABLE */}
      {activeTab === "STOCK" && (
        <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A1A1F] text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                <th className="py-3.5 px-4">Raw Ingredient</th>
                <th className="py-3.5 px-4">Category / Vendor</th>
                <th className="py-3.5 px-4">Current Stock vs Par</th>
                <th className="py-3.5 px-4">Status Indicator</th>
                <th className="py-3.5 px-4">Unit Cost ($)</th>
                <th className="py-3.5 px-4">Total Value</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1A1F] text-sm">
              {ingredients.map((ing) => {
                const isCritical = ing.currentStock < ing.parLevel;
                return (
                  <tr key={ing.id} className="hover:bg-white/[0.02] transition">
                    <td className="py-4 px-4 font-bold text-white">
                      <div>{ing.name}</div>
                      <span className="text-[10px] font-mono text-gray-500">ID: {ing.id} • Restocked: {ing.lastRestocked}</span>
                    </td>
                    <td className="py-4 px-4 text-xs">
                      <span className="px-2 py-0.5 rounded bg-black/40 text-gray-300 border border-white/5">{ing.category}</span>
                      <div className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                        <Truck className="w-3 h-3 text-[#C9A84C]" /> {ing.vendor}
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      <div className="flex items-center gap-2">
                        <span className={`text-base font-black ${isCritical ? "text-red-400" : "text-emerald-400"}`}>
                          {ing.currentStock}
                        </span>
                        <span className="text-gray-500 text-xs">/ {ing.parLevel} {ing.unit}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4 font-mono">
                      {isCritical ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-500/20 text-red-400 border border-red-500/40 flex items-center gap-1.5 w-max">
                          <AlertTriangle className="w-3.5 h-3.5" /> Below Par
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 w-max">
                          <CheckCircle className="w-3.5 h-3.5" /> Optimal
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-4 font-mono text-gray-300">
                      ${ing.unitCost.toFixed(2)} / {ing.unit}
                    </td>
                    <td className="py-4 px-4 font-mono font-bold text-[#C9A84C]">
                      ${(ing.currentStock * ing.unitCost).toFixed(2)}
                    </td>
                    <td className="py-4 px-4">
                      <button
                        onClick={() => {
                          setRestockModalItem(ing);
                          setRestockAmount(Math.ceil(ing.parLevel - ing.currentStock + 5));
                        }}
                        className="px-3 py-1.5 rounded-xl bg-[#2A1A1F] hover:bg-[#C9A84C] hover:text-[#0A0A0A] text-[#F5F0E8] font-bold text-xs transition flex items-center gap-1"
                      >
                        <Plus className="w-3.5 h-3.5" /> Restock
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: RECIPE BILL OF MATERIALS (BOM) */}
      {activeTab === "BOM" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bomList.map((bom) => (
            <div key={bom.menuItemId} className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-[#C9A84C]/50 transition">
              <div>
                <div className="flex justify-between items-start mb-4 border-b border-[#2A1A1F] pb-3">
                  <div>
                    <span className="text-[10px] font-mono uppercase font-bold tracking-widest text-[#C9A84C]">Recipe BOM Mapping</span>
                    <h3 className="text-lg font-bold text-white mt-0.5">{bom.menuItemName}</h3>
                  </div>
                  <span className="px-2.5 py-1 rounded-lg bg-[#2A1A1F] text-xs font-mono font-bold text-gray-300">
                    {bom.ingredients.length} Ingredients
                  </span>
                </div>

                <div className="space-y-3 my-4">
                  <p className="text-xs font-bold uppercase text-gray-400 font-mono">Deducted per 1x Order:</p>
                  {bom.ingredients.map((ing) => {
                    const raw = ingredients.find(i => i.id === ing.ingredientId);
                    const isLow = raw && raw.currentStock < raw.parLevel;
                    return (
                      <div key={ing.ingredientId} className="p-3 bg-[#0A0A0A] rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                        <div>
                          <span className="font-bold text-white block">{ing.ingredientName}</span>
                          {raw && (
                            <span className={`text-[10px] font-mono ${isLow ? "text-red-400" : "text-gray-500"}`}>
                              Current Stock: {raw.currentStock} {raw.unit} {isLow && "(Below Par)"}
                            </span>
                          )}
                        </div>
                        <span className="font-mono font-black text-[#C9A84C] bg-[#111111] px-3 py-1 rounded-xl border border-[#2A1A1F]">
                          -{ing.quantityUsed} {ing.unit}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-gray-400 flex items-center gap-1.5 font-mono">
                <Layers className="w-3.5 h-3.5 text-[#C9A84C]" />
                <span>Auto-deducted from live inventory via `createOrder` trigger.</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TAB 3: AUTOMATED PURCHASE ORDER (PO) GENERATOR */}
      {activeTab === "PO" && (
        <div className="bg-[#111111] border border-[#C9A84C]/60 rounded-3xl p-8 shadow-2xl max-w-4xl mx-auto">
          {generatedPO ? (
            <div>
              {/* PO Invoice Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2A1A1F] pb-6 mb-6 gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <FileText className="w-6 h-6 text-[#C9A84C]" />
                    <span className="font-mono font-bold text-sm uppercase text-gray-400">Official Purchase Order</span>
                  </div>
                  <h2 className="text-2xl font-bold text-white mt-1">{generatedPO.poNumber}</h2>
                  <p className="text-xs text-gray-400 mt-0.5">Generated: {generatedPO.date}</p>
                </div>

                <div className="text-right bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A1A1F]">
                  <span className="text-xs text-gray-400 block">Restock Invoice Total:</span>
                  <span className="text-2xl font-black text-[#C9A84C]">${generatedPO.totalCost.toFixed(2)}</span>
                </div>
              </div>

              {/* Vendor & Delivery Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 bg-[#0A0A0A] rounded-2xl border border-white/5 text-xs">
                <div>
                  <span className="text-gray-500 block uppercase font-mono font-bold mb-1">Purveyor / Vendor:</span>
                  <span className="font-bold text-white text-sm block">{generatedPO.vendor}</span>
                  <span className="text-gray-400">Orders @ Prime Purveyors Direct</span>
                </div>
                <div>
                  <span className="text-gray-500 block uppercase font-mono font-bold mb-1">Ship To / Delivery Address:</span>
                  <span className="font-bold text-white text-sm block">The Golden Fork — Fine Dining Flagship</span>
                  <span className="text-gray-400">Loading Dock B • Receiving Time: 6:00 AM - 10:00 AM</span>
                </div>
              </div>

              {/* PO Items Table */}
              <table className="w-full text-left border-collapse mb-8 text-xs">
                <thead>
                  <tr className="border-b border-[#2A1A1F] font-bold uppercase text-gray-400 font-mono">
                    <th className="py-3 px-3">Item Description</th>
                    <th className="py-3 px-3">Restock Quantity Needed</th>
                    <th className="py-3 px-3">Contract Unit Cost</th>
                    <th className="py-3 px-3">Extended Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5 text-sm font-mono">
                  {generatedPO.items.map((item, idx) => (
                    <tr key={idx} className="hover:bg-white/[0.02]">
                      <td className="py-3.5 px-3 font-bold text-white">{item.name}</td>
                      <td className="py-3.5 px-3 font-black text-amber-400">{item.needed} {item.unit}</td>
                      <td className="py-3.5 px-3 text-gray-300">${item.unitCost.toFixed(2)} / {item.unit}</td>
                      <td className="py-3.5 px-3 font-bold text-[#C9A84C]">${item.totalCost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* PO Action Buttons */}
              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-[#2A1A1F]">
                <button
                  onClick={() => generateAutoPO()}
                  className="px-4 py-2.5 rounded-xl bg-[#2A1A1F] hover:bg-white/10 text-white font-bold text-xs transition flex items-center gap-1.5"
                >
                  <RefreshCw className="w-4 h-4" /> Recalculate PO
                </button>
                <button
                  onClick={() => alert("PO successfully dispatched via automated EDI / Email to purveyor!")}
                  className="px-6 py-2.5 rounded-xl bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition flex items-center gap-2 shadow-lg"
                >
                  <Mail className="w-4 h-4" /> Dispatch PO via EDI / Email
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-6 py-2.5 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs hover:bg-white transition flex items-center gap-2 shadow-xl"
                >
                  <Download className="w-4 h-4" /> Download PO (PDF)
                </button>
              </div>
            </div>
          ) : (
            <div className="py-16 text-center flex flex-col items-center justify-center gap-4">
              <FileText className="w-16 h-16 text-[#C9A84C] opacity-40 animate-bounce" />
              <h3 className="font-bold text-xl text-white">Generate Automated Restock Purchase Order</h3>
              <p className="text-xs text-gray-400 max-w-md leading-relaxed">
                Click below to analyze all raw ingredients operating below safety par levels (`{criticalItems.length} items currently low`) and construct an official restock invoice with exact contract unit pricing.
              </p>
              <button
                onClick={() => generateAutoPO()}
                className="px-8 py-4 rounded-2xl bg-[#7C1D35] text-[#C9A84C] hover:bg-[#9D2442] font-black text-sm transition shadow-2xl flex items-center gap-2"
              >
                <Sparkles className="w-5 h-5" /> Generate Restock PO Now
              </button>
            </div>
          )}
        </div>
      )}

      {/* Quick Restock Modal */}
      <AnimatePresence>
        {restockModalItem && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border-2 border-[#C9A84C] rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center shadow-2xl"
            >
              <Boxes className="w-14 h-14 text-[#C9A84C] mb-4" />
              <h3 className="font-bold text-xl text-white">Quick Restock Ingredient</h3>
              <p className="text-xs text-gray-400 mt-1 mb-6">
                Receive purveyor shipment for <span className="font-bold text-[#C9A84C]">{restockModalItem.name}</span>
              </p>

              <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A1A1F] w-full mb-6 font-mono text-left text-xs space-y-1">
                <div className="flex justify-between"><span>Current Stock:</span><span className="font-bold text-white">{restockModalItem.currentStock} {restockModalItem.unit}</span></div>
                <div className="flex justify-between"><span>Par Level:</span><span className="font-bold text-[#C9A84C]">{restockModalItem.parLevel} {restockModalItem.unit}</span></div>
              </div>

              <div className="w-full mb-6 text-left">
                <label className="text-xs font-bold uppercase text-gray-400 block mb-2 font-mono">Added Quantity ({restockModalItem.unit}):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    value={restockAmount}
                    onChange={(e) => setRestockAmount(Number(e.target.value))}
                    className="flex-1 bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl p-3 font-mono font-bold text-lg text-white text-center focus:outline-none focus:border-[#C9A84C]"
                  />
                  <span className="font-bold text-sm text-gray-400">{restockModalItem.unit}</span>
                </div>
              </div>

              <div className="flex gap-3 w-full">
                <button
                  onClick={() => setRestockModalItem(null)}
                  className="flex-1 py-3 rounded-xl bg-[#2A1A1F] text-white font-bold text-xs hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRestockSubmit}
                  disabled={isRestocking}
                  className="flex-1 py-3 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs hover:bg-white transition shadow-lg"
                >
                  {isRestocking ? "Restocking..." : "Commit Restock"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
