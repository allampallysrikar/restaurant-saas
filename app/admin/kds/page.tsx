"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { getLiveOrders, updateOrderStatus } from "@/app/actions/orders";
import { Clock, RefreshCw, CheckCircle, ChefHat, Play, Volume2, VolumeX, Keyboard, CheckSquare, Square } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

interface OrderItem {
  id: string;
  quantity: number;
  menuItem: { name: string };
}

interface Order {
  id: string;
  status: string;
  createdAt: Date;
  deliveryAdd?: string;
  items: OrderItem[];
}

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.96, y: 12 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { ease: "easeOut", duration: 0.25 } }
};

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [chimeEnabled, setChimeEnabled] = useState(true);
  const [completedItems, setCompletedItems] = useState<Record<string, boolean>>({});
  const [bumpFeedback, setBumpFeedback] = useState<string | null>(null);

  // Keep track of previous order IDs to detect brand new tickets & play chime
  const previousOrderIdsRef = useRef<Set<string>>(new Set());
  const isFirstLoadRef = useRef(true);

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Web Audio API Synthesizer for Kitchen Bell Chime
  const playKitchenChime = useCallback(() => {
    if (!chimeEnabled) return;
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();

      // First note (E5 = 659.25 Hz)
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = "sine";
      osc1.frequency.setValueAtTime(659.25, ctx.currentTime);
      gain1.gain.setValueAtTime(0.3, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.6);

      // Second note higher (A5 = 880 Hz) at +150ms
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(880, ctx.currentTime + 0.15);
      gain2.gain.setValueAtTime(0.4, ctx.currentTime + 0.15);
      gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.8);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start(ctx.currentTime + 0.15);
      osc2.stop(ctx.currentTime + 0.8);
    } catch (e) {
      console.warn("Audio chime prevented by browser autoplay restrictions:", e);
    }
  }, [chimeEnabled]);

  const fetchOrders = useCallback(async (silent = false) => {
    if (!silent) setIsRefreshing(true);
    try {
      const allOrders = await getLiveOrders();
      const activeOrders = allOrders
        .filter((o: any) => o.status === "PENDING" || o.status === "PREPARING")
        .map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt)
        }));

      // Check if new tickets arrived
      const currentOrderIds = new Set(activeOrders.map((o: any) => o.id));
      if (!isFirstLoadRef.current) {
        let hasNewOrder = false;
        for (const id of currentOrderIds) {
          if (!previousOrderIdsRef.current.has(id)) {
            hasNewOrder = true;
            break;
          }
        }
        if (hasNewOrder) {
          playKitchenChime();
        }
      } else {
        isFirstLoadRef.current = false;
      }
      previousOrderIdsRef.current = currentOrderIds;

      setOrders(activeOrders as Order[]);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
    if (!silent) setIsRefreshing(false);
  }, [playKitchenChime]);

  useEffect(() => {
    fetchOrders();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(() => fetchOrders(true), 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh, fetchOrders]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    // Show visual bump feedback
    setBumpFeedback(`Order #${orderId.slice(0, 6)} bumped to ${status === "PREPARING" ? "Preparing" : "Ready"}`);
    setTimeout(() => setBumpFeedback(null), 2500);

    // Optimistically update
    setOrders((prev) => prev.filter(o => o.id !== orderId || (status === "PREPARING" && o.status !== status)));
    await updateOrderStatus(orderId, status);
    fetchOrders(true);
  };

  const toggleItemCompletion = (orderId: string, itemIdx: number) => {
    const key = `${orderId}_${itemIdx}`;
    setCompletedItems(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  // Keyboard Bump-Bar Listener (Keys 1-9, Space, and M)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside an input
      if (["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)) return;

      if (e.code === "KeyM") {
        e.preventDefault();
        setChimeEnabled(prev => !prev);
        return;
      }

      if (orders.length === 0) return;

      // Space key bumps the oldest ticket (idx 0)
      if (e.code === "Space") {
        e.preventDefault();
        const oldestOrder = orders[0];
        const nextStatus = oldestOrder.status === "PENDING" ? "PREPARING" : "OUT_FOR_DELIVERY";
        handleUpdateStatus(oldestOrder.id, nextStatus);
        return;
      }

      // Numeric keys 1 - 9 bump tickets index 0 - 8
      const keyNum = parseInt(e.key, 10);
      if (!isNaN(keyNum) && keyNum >= 1 && keyNum <= 9) {
        const targetIdx = keyNum - 1;
        if (targetIdx < orders.length) {
          e.preventDefault();
          const targetOrder = orders[targetIdx];
          const nextStatus = targetOrder.status === "PENDING" ? "PREPARING" : "OUT_FOR_DELIVERY";
          handleUpdateStatus(targetOrder.id, nextStatus);
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [orders]);

  const getCardBorder = (createdAt: Date) => {
    const minutesElapsed = (currentTime.getTime() - createdAt.getTime()) / 60000;
    if (minutesElapsed > 30) return "border-[#EF4444] shadow-[0_0_20px_rgba(239,68,68,0.35)] animate-pulse";
    if (minutesElapsed >= 15) return "border-[#F59E0B] shadow-[0_0_12px_rgba(245,158,11,0.2)]";
    return "border-[#10B981]/80";
  };

  const getTimeElapsedStr = (createdAt: Date) => {
    const minutesElapsed = Math.floor((currentTime.getTime() - createdAt.getTime()) / 60000);
    return `${minutesElapsed}m ago`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8] flex flex-col">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 border-b border-[#2A1A1F] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#7C1D35] rounded-xl text-[#F5F0E8] shadow-lg">
              <ChefHat className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight">
                Kitchen Display System (KDS)
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Live Line Monitor
                </span>
                <span>•</span>
                <span className="flex items-center gap-1 font-mono">
                  <Clock className="w-3.5 h-3.5 text-[#C9A84C]" />
                  {currentTime.toLocaleTimeString()}
                </span>
              </p>
            </div>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Audio Chime Toggle */}
          <button
            onClick={() => setChimeEnabled(!chimeEnabled)}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-bold border transition shadow-sm ${
              chimeEnabled 
                ? "bg-[#C9A84C]/10 text-[#C9A84C] border-[#C9A84C]/40 hover:bg-[#C9A84C]/20" 
                : "bg-[#2A1A1F] text-gray-400 border-transparent hover:text-white"
            }`}
            title="Press [M] key to toggle chime"
          >
            {chimeEnabled ? <Volume2 className="w-4 h-4 animate-bounce" /> : <VolumeX className="w-4 h-4" />}
            <span>{chimeEnabled ? "Chime ON (M)" : "Chime Muted"}</span>
          </button>

          {/* Auto Refresh Toggle */}
          <div className="flex items-center gap-3 bg-[#111111] px-3.5 py-2 rounded-xl border border-[#2A1A1F]">
            <label className="flex items-center gap-2 cursor-pointer text-sm font-medium">
              <input 
                type="checkbox" 
                checked={autoRefresh} 
                onChange={(e) => setAutoRefresh(e.target.checked)} 
                className="accent-[#7C1D35] w-4 h-4 rounded"
              />
              Auto-refresh (10s)
            </label>
            <button 
              onClick={() => fetchOrders(false)}
              className={`p-1.5 rounded-lg bg-[#2A1A1F] hover:bg-[#7C1D35] transition ${isRefreshing ? 'animate-spin text-[#C9A84C]' : 'text-[#F5F0E8]'}`}
              title="Refresh Now"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Bump Notification Banner */}
      <AnimatePresence>
        {bumpFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mb-6 px-4 py-3 bg-[#10B981]/20 border border-[#10B981] rounded-xl text-[#10B981] font-bold flex items-center justify-between shadow-lg"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              {bumpFeedback}
            </span>
            <span className="text-xs font-mono uppercase bg-[#10B981] text-black px-2 py-0.5 rounded font-black">Bumped via KDS</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tickets Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 flex-1 items-start">
        {orders.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-32 text-[#F5F0E8]/50 bg-[#111111]/40 border border-dashed border-[#2A1A1F] rounded-3xl">
            <div className="w-20 h-20 bg-[#10B981]/10 rounded-full flex items-center justify-center mb-4 border border-[#10B981]/30">
              <CheckCircle className="w-10 h-10 text-[#10B981]" />
            </div>
            <h3 className="text-2xl font-bold text-[#F5F0E8] mb-1">Kitchen is Clean & Caught Up!</h3>
            <p className="text-gray-400 max-w-md text-center text-sm">
              New customer orders placed from the dining room or online will appear here instantly with an audible chime.
            </p>
          </div>
        ) : (
          orders.map((order, idx) => {
            // Calculate how many items are checked off on this ticket
            const totalItems = order.items.length;
            const checkedCount = order.items.filter((_, i) => completedItems[`${order.id}_${i}`]).length;
            const allChecked = totalItems > 0 && checkedCount === totalItems;
            const keyShortcut = idx + 1; // 1 to 9

            return (
              <motion.div
                key={order.id}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                layout
                className={`bg-[#111111] border-2 rounded-2xl p-5 flex flex-col relative shadow-xl transition-all ${getCardBorder(order.createdAt)}`}
              >
                {/* Bump Bar Key Shortcut Badge */}
                {keyShortcut <= 9 && (
                  <div className="absolute -top-3.5 -right-2 bg-[#C9A84C] text-[#0A0A0A] font-mono font-black text-xs px-2.5 py-1 rounded-lg shadow-md border border-[#0A0A0A] flex items-center gap-1">
                    <Keyboard className="w-3 h-3" />
                    KEY [{keyShortcut}]
                  </div>
                )}

                {/* Ticket Header */}
                <div className="flex justify-between items-start mb-4 border-b border-[#2A1A1F] pb-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-[family-name:var(--font-playfair)] font-bold text-xl text-[#C9A84C]">
                        {order.deliveryAdd || `Order #${order.id.slice(0, 6)}`}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        order.status === "PENDING" ? "bg-amber-500/20 text-amber-400 border border-amber-500/30" : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                      }`}>
                        {order.status}
                      </span>
                      {allChecked && (
                        <span className="text-[10px] font-bold bg-[#10B981]/20 text-[#10B981] px-2 py-0.5 rounded border border-[#10B981]/30">
                          ALL ITEMS PREPPED ✓
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-sm font-mono font-bold text-[#F5F0E8] bg-[#2A1A1F] px-2.5 py-1.5 rounded-lg border border-white/5 shadow-inner block">
                      {getTimeElapsedStr(order.createdAt)}
                    </span>
                    <span className="text-[10px] text-gray-500 block mt-1 font-mono">
                      {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Item Check-off List */}
                <div className="flex-1 mb-6 space-y-2.5">
                  <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 flex justify-between items-center">
                    <span>Prep Items ({checkedCount}/{totalItems})</span>
                    <span className="text-[10px] text-[#C9A84C]/80 font-normal">Click item to check off</span>
                  </div>
                  {order.items.map((item, i) => {
                    const isChecked = !!completedItems[`${order.id}_${i}`];
                    return (
                      <div 
                        key={item.id || i} 
                        onClick={() => toggleItemCompletion(order.id, i)}
                        className={`flex items-start p-3 rounded-xl border cursor-pointer select-none transition-all ${
                          isChecked 
                            ? "bg-[#10B981]/10 border-[#10B981]/40 text-gray-400 line-through" 
                            : "bg-[#181818] border-[#2A1A1F] hover:border-[#C9A84C]/50 text-[#F5F0E8]"
                        }`}
                      >
                        <div className="mr-3 mt-0.5 text-[#C9A84C]">
                          {isChecked ? (
                            <CheckSquare className="w-5 h-5 text-[#10B981] flex-shrink-0" />
                          ) : (
                            <Square className="w-5 h-5 text-gray-500 flex-shrink-0" />
                          )}
                        </div>
                        <span className={`font-mono font-bold w-9 text-base ${isChecked ? "text-[#10B981]" : "text-[#C9A84C]"}`}>
                          {item.quantity}x
                        </span>
                        <span className="flex-1 font-medium text-base leading-snug">
                          {item.menuItem?.name || "Unknown Item"}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Ticket Bump Footer Actions */}
                <div className="pt-4 border-t border-[#2A1A1F] flex flex-col gap-2 mt-auto">
                  {order.status === "PENDING" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                      className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                        allChecked 
                          ? "bg-[#10B981] hover:bg-[#059669] text-white animate-pulse" 
                          : "bg-[#7C1D35] hover:bg-[#9D2442] text-[#F5F0E8]"
                      }`}
                    >
                      <Play className="w-5 h-5 fill-current" />
                      <span>Start Preparing {allChecked && "(All Checked)"}</span>
                    </button>
                  )}
                  {order.status === "PREPARING" && (
                    <button
                      onClick={() => handleUpdateStatus(order.id, "OUT_FOR_DELIVERY")}
                      className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition shadow-lg ${
                        allChecked 
                          ? "bg-[#10B981] hover:bg-[#059669] text-white shadow-[0_0_15px_rgba(16,185,129,0.4)] animate-bounce" 
                          : "bg-[#10B981]/80 hover:bg-[#10B981] text-white"
                      }`}
                    >
                      <CheckCircle className="w-5 h-5" />
                      <span>Bump Ticket Ready / Delivery</span>
                    </button>
                  )}
                  <button
                    onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                    className="w-full py-2 rounded-lg bg-transparent border border-[#2A1A1F] hover:bg-[#2A1A1F] text-[#F5F0E8]/50 text-xs flex items-center justify-center gap-1.5 transition"
                  >
                    <span>Archive / Mark Completed</span>
                  </button>
                </div>
              </motion.div>
            );
          })
        )}
      </div>

      {/* Bottom Keyboard Bump Bar Helper */}
      <div className="mt-8 pt-4 border-t border-[#2A1A1F] bg-[#111111]/80 px-4 py-3 rounded-xl flex flex-wrap items-center justify-between text-xs text-gray-400 gap-4">
        <div className="flex items-center gap-2 font-mono text-[#C9A84C]">
          <Keyboard className="w-4 h-4" />
          <span className="font-bold">BUMP BAR KEYBOARD CONTROLS ACTIVE:</span>
        </div>
        <div className="flex flex-wrap items-center gap-6 font-mono">
          <span><kbd className="bg-[#2A1A1F] text-[#F5F0E8] px-2 py-0.5 rounded border border-white/10 font-bold">[1-9]</kbd> Bump ticket #1 to #9</span>
          <span><kbd className="bg-[#2A1A1F] text-[#F5F0E8] px-2 py-0.5 rounded border border-white/10 font-bold">[Space]</kbd> Bump oldest ticket</span>
          <span><kbd className="bg-[#2A1A1F] text-[#F5F0E8] px-2 py-0.5 rounded border border-white/10 font-bold">[M]</kbd> Toggle audio chime</span>
        </div>
      </div>
    </div>
  );
}
