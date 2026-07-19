"use client";

import React, { useEffect, useState } from "react";
import { getLiveOrders, updateOrderStatus } from "@/app/actions/orders";
import { Clock, RefreshCw, CheckCircle, ChefHat, Play } from "lucide-react";
import { motion, Variants } from "framer-motion";

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
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { ease: "easeOut", duration: 0.3 } }
};

export default function KDSPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const fetchOrders = async () => {
    setIsRefreshing(true);
    try {
      const allOrders = await getLiveOrders();
      const activeOrders = allOrders
        .filter((o: any) => o.status === "PENDING" || o.status === "PREPARING")
        .map((o: any) => ({
          ...o,
          createdAt: new Date(o.createdAt)
        }));
      setOrders(activeOrders as Order[]);
    } catch (error) {
      console.error("Failed to fetch orders:", error);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    fetchOrders();
    let interval: NodeJS.Timeout;
    if (autoRefresh) {
      interval = setInterval(fetchOrders, 10000);
    }
    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    setOrders((prev) => prev.filter(o => o.id !== orderId || (status === "PREPARING" && o.status !== status))); // optimistic remove if done or keep if PREPARING
    await updateOrderStatus(orderId, status);
    fetchOrders();
  };

  const getCardBorder = (createdAt: Date) => {
    const minutesElapsed = (currentTime.getTime() - createdAt.getTime()) / 60000;
    if (minutesElapsed > 30) return "border-[#EF4444] shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse";
    if (minutesElapsed >= 15) return "border-[#F59E0B]";
    return "border-[#10B981]";
  };

  const getTimeElapsedStr = (createdAt: Date) => {
    const minutesElapsed = Math.floor((currentTime.getTime() - createdAt.getTime()) / 60000);
    return `${minutesElapsed}m ago`;
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#C9A84C] flex items-center gap-2">
            <ChefHat className="w-8 h-8" />
            Kitchen Display System
          </h1>
          <p className="text-[#F5F0E8]/60 mt-1 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {currentTime.toLocaleTimeString()}
          </p>
        </div>
        
        <div className="flex items-center gap-4 bg-[#111111] p-2 rounded-lg border border-[#2A1A1F]">
          <label className="flex items-center gap-2 cursor-pointer text-sm">
            <input 
              type="checkbox" 
              checked={autoRefresh} 
              onChange={(e) => setAutoRefresh(e.target.checked)} 
              className="accent-[#7C1D35] w-4 h-4"
            />
            Auto-refresh (10s)
          </label>
          <button 
            onClick={fetchOrders}
            className={`p-2 rounded-md bg-[#2A1A1F] hover:bg-[#7C1D35] transition ${isRefreshing ? 'animate-spin text-[#C9A84C]' : 'text-[#F5F0E8]'}`}
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {orders.length === 0 ? (
          <div className="col-span-full flex flex-col items-center justify-center py-20 text-[#F5F0E8]/50">
            <CheckCircle className="w-16 h-16 mb-4 opacity-50 text-[#10B981]" />
            <p className="text-xl">No active orders. Kitchen is caught up!</p>
          </div>
        ) : (
          orders.map((order, idx) => (
            <motion.div
              key={order.id}
              variants={fadeIn}
              initial="hidden"
              animate="visible"
              className={`bg-[#111111] border-2 rounded-xl p-5 flex flex-col ${getCardBorder(order.createdAt)}`}
            >
              <div className="flex justify-between items-start mb-4 border-b border-[#2A1A1F] pb-4">
                <div>
                  <h3 className="font-bold text-lg text-[#C9A84C]">
                    {order.deliveryAdd || `Order #${order.id.slice(0, 6)}`}
                  </h3>
                  <span className={`text-xs font-semibold px-2 py-1 rounded mt-1 inline-block ${
                    order.status === "PENDING" ? "bg-white/10 text-white" : "bg-[#7C1D35] text-[#F5F0E8]"
                  }`}>
                    {order.status}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-mono text-[#F5F0E8]/80 bg-[#2A1A1F] px-2 py-1 rounded">
                    {getTimeElapsedStr(order.createdAt)}
                  </span>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                {order.items.map((item, i) => (
                  <div key={item.id || i} className="flex items-start text-[#F5F0E8]">
                    <span className="font-bold text-[#C9A84C] w-8">{item.quantity}x</span>
                    <span className="flex-1">{item.menuItem?.name || "Unknown Item"}</span>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t border-[#2A1A1F] flex flex-col gap-2 mt-auto">
                {order.status === "PENDING" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "PREPARING")}
                    className="w-full py-3 rounded-lg bg-[#7C1D35] hover:bg-[#9D2442] text-[#F5F0E8] font-bold flex items-center justify-center gap-2 transition"
                  >
                    <Play className="w-5 h-5" /> Start Preparing
                  </button>
                )}
                {order.status === "PREPARING" && (
                  <button
                    onClick={() => handleUpdateStatus(order.id, "OUT_FOR_DELIVERY")}
                    className="w-full py-3 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold flex items-center justify-center gap-2 transition"
                  >
                    <CheckCircle className="w-5 h-5" /> Ready / Out for Delivery
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus(order.id, "DELIVERED")}
                  className="w-full py-2 rounded-lg bg-transparent border border-[#2A1A1F] hover:bg-[#2A1A1F] text-[#F5F0E8]/70 text-sm flex items-center justify-center gap-2 transition"
                >
                  Mark Delivered / Completed
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
