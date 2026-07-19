"use client";

import React, { useState } from "react";
import { Bell, Droplets, Receipt, ShieldAlert, CheckCircle, Loader2 } from "lucide-react";
import { requestTableService, TableServiceCall } from "@/app/actions/table-service";
import { motion, AnimatePresence } from "framer-motion";

interface TableServiceBarProps {
  tableId: string;
}

export default function TableServiceBar({ tableId }: TableServiceBarProps) {
  const [activeRequest, setActiveRequest] = useState<string | null>(null);
  const [loadingType, setLoadingType] = useState<string | null>(null);
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);

  const handleRequest = async (type: TableServiceCall["requestType"], label: string) => {
    setLoadingType(type);
    try {
      const res = await requestTableService(tableId, type);
      if (res.success) {
        setActiveRequest(type);
        setFeedbackMsg(`Server notified: ${label}. Your waiter is on the way!`);
        setTimeout(() => setFeedbackMsg(null), 5000);
      }
    } catch (e) {
      console.error(e);
    }
    setLoadingType(null);
  };

  return (
    <div className="w-full bg-[#111111]/95 border-t border-[#2A1A1F] p-3 backdrop-blur-md shadow-2xl z-40">
      <div className="max-w-4xl mx-auto flex flex-col gap-2">
        
        {/* Feedback Alert Pill */}
        <AnimatePresence>
          {feedbackMsg && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="bg-[#10B981]/20 border border-[#10B981] rounded-xl px-4 py-2 text-xs font-bold text-[#10B981] flex items-center justify-between shadow-lg"
            >
              <span className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 flex-shrink-0" />
                {feedbackMsg}
              </span>
              <span className="text-[10px] uppercase font-mono bg-[#10B981] text-black px-2 py-0.5 rounded font-black">Dispatched</span>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex items-center justify-between gap-2 text-xs">
          <span className="font-mono text-[#C9A84C] font-bold whitespace-nowrap flex items-center gap-1.5 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
            Table Portal: {tableId}
          </span>

          <div className="flex items-center gap-2 flex-1 justify-end sm:justify-center">
            <button
              onClick={() => handleRequest("CALL_WAITER", "Call Waiter")}
              disabled={loadingType !== null}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 shadow-md ${
                activeRequest === "CALL_WAITER"
                  ? "bg-[#C9A84C] text-[#0A0A0A] font-black"
                  : "bg-[#7C1D35] hover:bg-[#9D2442] text-[#F5F0E8]"
              }`}
            >
              {loadingType === "CALL_WAITER" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Bell className="w-4 h-4 fill-current" />
              )}
              <span>Call Waiter</span>
            </button>

            <button
              onClick={() => handleRequest("REFILL_WATER", "Refill Water")}
              disabled={loadingType !== null}
              className={`flex-1 sm:flex-initial px-3 py-2.5 rounded-xl font-semibold transition flex items-center justify-center gap-1.5 border ${
                activeRequest === "REFILL_WATER"
                  ? "bg-blue-500/20 border-blue-400 text-blue-300 font-bold"
                  : "bg-[#181818] border-[#2A1A1F] text-gray-300 hover:text-white hover:border-[#C9A84C]/40"
              }`}
            >
              {loadingType === "REFILL_WATER" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Droplets className="w-4 h-4 text-blue-400" />
              )}
              <span>Refill Water</span>
            </button>

            <button
              onClick={() => handleRequest("REQUEST_BILL", "Request Bill / Check")}
              disabled={loadingType !== null}
              className={`flex-1 sm:flex-initial px-3.5 py-2.5 rounded-xl font-bold transition flex items-center justify-center gap-1.5 border ${
                activeRequest === "REQUEST_BILL"
                  ? "bg-emerald-500 text-black font-black"
                  : "bg-[#181818] border-[#C9A84C]/40 text-[#C9A84C] hover:bg-[#C9A84C]/10"
              }`}
            >
              {loadingType === "REQUEST_BILL" ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Receipt className="w-4 h-4" />
              )}
              <span>Request Bill</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
