"use client";

import React from "react";
import { Check, X, Clock, Printer } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOrdersPage() {
  const orders = [
    { id: "ORD-9382", customer: "Liam Johnson", items: [{name: "Truffle Arancini", qty: 2}, {name: "Wagyu Ribeye", qty: 1}], total: 145.00, status: "Preparing", time: "10:42 AM", type: "Dine-in (Table 4)" },
    { id: "ORD-9381", customer: "Emma Williams", items: [{name: "Lobster Ravioli", qty: 1}], total: 34.00, status: "Ready", time: "10:15 AM", type: "Takeaway" },
    { id: "ORD-9380", customer: "Noah Brown", items: [{name: "Matcha Tiramisu", qty: 4}, {name: "Espresso", qty: 2}], total: 210.50, status: "Pending", time: "10:55 AM", type: "Delivery" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-400">Live kitchen queue and order processing.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Orders Column */}
        <div className="lg:col-span-2 space-y-4">
          {orders.map((order, i) => (
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              key={order.id} 
              className="bg-white/5 border border-white/10 rounded-2xl p-6"
            >
              <div className="flex justify-between items-start mb-4 border-b border-white/10 pb-4">
                <div>
                  <div className="flex items-center space-x-3 mb-1">
                    <h3 className="text-lg font-bold">{order.id}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'Preparing' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' : 
                      order.status === 'Ready' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' : 
                      'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{order.customer} • {order.type} • {order.time}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${order.total.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Paid via Razorpay</p>
                </div>
              </div>

              <div className="mb-6">
                <ul className="space-y-2">
                  {order.items.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-300"><span className="text-gray-500 mr-2">{item.qty}x</span> {item.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition flex items-center justify-center">
                  <Check className="w-4 h-4 mr-2" /> Mark Ready
                </button>
                <button className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition">
                  <X className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Action Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
            <h3 className="font-bold mb-4 flex items-center"><Clock className="w-5 h-5 mr-2 text-primary" /> Kitchen Status</h3>
            <div className="space-y-4 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-400">Est. Wait Time</span>
                <span className="font-bold text-orange-400">18 mins</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Pending Tickets</span>
                <span className="font-bold">12</span>
              </div>
              <button className="w-full mt-2 py-2 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition">
                Pause Online Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
