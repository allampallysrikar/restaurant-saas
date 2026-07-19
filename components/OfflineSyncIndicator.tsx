"use client";

import React, { useState, useEffect } from "react";
import { Wifi, WifiOff, RefreshCw, CheckCircle, AlertTriangle, HardDriveUpload, Cloud } from "lucide-react";
import { getOfflineOrders, syncAllOfflineOrders, OfflineOrderPayload } from "@/lib/offline-sync";
import { createOrder } from "@/app/actions/orders";
import { motion, AnimatePresence } from "framer-motion";

export default function OfflineSyncIndicator() {
  const [isOnline, setIsOnline] = useState(true);
  const [queuedOrders, setQueuedOrders] = useState<OfflineOrderPayload[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncResult, setLastSyncResult] = useState<{ synced: number; failed: number } | null>(null);

  useEffect(() => {
    // Initial check
    setIsOnline(navigator.onLine);
    setQueuedOrders(getOfflineOrders());

    const handleOnline = () => {
      setIsOnline(true);
      // Automatically trigger sync when coming back online
      triggerSync();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    const handleOfflineChange = (e: any) => {
      if (e.detail) setQueuedOrders(e.detail);
      else setQueuedOrders(getOfflineOrders());
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);
    window.addEventListener("golden_fork_offline_change", handleOfflineChange);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
      window.removeEventListener("golden_fork_offline_change", handleOfflineChange);
    };
  }, []);

  const triggerSync = async () => {
    const currentQueue = getOfflineOrders();
    if (currentQueue.length === 0) return;

    setIsSyncing(true);
    setLastSyncResult(null);
    try {
      const result = await syncAllOfflineOrders(createOrder);
      setLastSyncResult(result);
      setTimeout(() => setLastSyncResult(null), 6000);
    } catch (e) {
      console.error("Auto-sync trigger error:", e);
    }
    setIsSyncing(false);
    setQueuedOrders(getOfflineOrders());
  };

  // If online and queue is empty and no recent sync notification, render minimal subtle badge or hide
  if (isOnline && queuedOrders.length === 0 && !lastSyncResult && !isSyncing) {
    return null;
  }

  return (
    <div className="fixed bottom-4 left-4 z-50 max-w-sm">
      <AnimatePresence>
        {/* Offline Alert Box */}
        {!isOnline && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-3.5 bg-amber-500 text-[#0A0A0A] rounded-2xl shadow-2xl font-bold flex items-center justify-between gap-3 border border-amber-400 mb-2"
          >
            <div className="flex items-center gap-2.5 text-xs">
              <WifiOff className="w-5 h-5 animate-pulse flex-shrink-0" />
              <div>
                <p className="font-extrabold text-black">Offline Local-First Mode</p>
                <p className="text-[10px] text-black/80 font-normal">POS & Table orders are saving locally (`IndexedDB`).</p>
              </div>
            </div>
            {queuedOrders.length > 0 && (
              <span className="bg-black text-amber-400 font-mono text-xs px-2.5 py-1 rounded-xl font-black">
                {queuedOrders.length} Queued
              </span>
            )}
          </motion.div>
        )}

        {/* Syncing Box */}
        {isSyncing && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="p-3.5 bg-[#111111] text-[#F5F0E8] border border-[#C9A84C] rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs mb-2"
          >
            <div className="flex items-center gap-2.5">
              <RefreshCw className="w-4 h-4 text-[#C9A84C] animate-spin flex-shrink-0" />
              <span>Replaying offline queue to Neon Postgres...</span>
            </div>
            <span className="text-[#C9A84C] font-mono font-bold">{queuedOrders.length} items</span>
          </motion.div>
        )}

        {/* Queued Orders Banner when Online */}
        {isOnline && queuedOrders.length > 0 && !isSyncing && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="p-3.5 bg-[#111111] text-[#F5F0E8] border border-amber-500/60 rounded-2xl shadow-2xl flex items-center justify-between gap-3 text-xs mb-2"
          >
            <div className="flex items-center gap-2">
              <HardDriveUpload className="w-4 h-4 text-amber-400 flex-shrink-0" />
              <div>
                <p className="font-bold text-white">{queuedOrders.length} Offline Orders Waiting</p>
                <p className="text-[10px] text-gray-400">Connection restored. Ready to upload.</p>
              </div>
            </div>
            <button
              onClick={triggerSync}
              className="px-3 py-1.5 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold hover:bg-white transition text-xs flex items-center gap-1 shadow-md"
            >
              <Cloud className="w-3.5 h-3.5" /> Sync Now
            </button>
          </motion.div>
        )}

        {/* Sync Result Toast */}
        {lastSyncResult && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className={`p-3 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-2xl ${
              lastSyncResult.failed === 0
                ? "bg-[#10B981]/90 border-emerald-400 text-black"
                : "bg-red-500/90 border-red-400 text-white"
            }`}
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0" />
              <span>Sync Complete: {lastSyncResult.synced} Orders uploaded to Neon!</span>
            </span>
            {lastSyncResult.failed > 0 && (
              <span className="bg-black/40 px-2 py-0.5 rounded text-[10px] text-white">
                {lastSyncResult.failed} failed
              </span>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
