"use client";

import React from "react";
import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUpRight } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminDashboard() {
  const stats = [
    { title: "Total Revenue", value: "$45,231.89", icon: <DollarSign className="w-6 h-6 text-green-400" />, trend: "+20.1%" },
    { title: "Active Orders", value: "12", icon: <ShoppingCart className="w-6 h-6 text-blue-400" />, trend: "+4" },
    { title: "Total Customers", value: "2,341", icon: <Users className="w-6 h-6 text-orange-400" />, trend: "+12%" },
    { title: "Conversion Rate", value: "4.2%", icon: <TrendingUp className="w-6 h-6 text-purple-400" />, trend: "+1.1%" },
  ];

  const recentOrders = [
    { id: "ORD-9382", customer: "Liam Johnson", items: 3, total: 145.00, status: "Preparing", time: "10 min ago" },
    { id: "ORD-9381", customer: "Emma Williams", items: 1, total: 34.00, status: "Ready", time: "25 min ago" },
    { id: "ORD-9380", customer: "Noah Brown", items: 5, total: 210.50, status: "Delivered", time: "1 hour ago" },
    { id: "ORD-9379", customer: "Olivia Davis", items: 2, total: 85.00, status: "Delivered", time: "2 hours ago" },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back, Admin. Here is what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white/5 border border-white/10 p-6 rounded-2xl"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
              <span className="flex items-center text-xs font-medium text-green-400 bg-green-400/10 px-2 py-1 rounded-full">
                {stat.trend} <ArrowUpRight className="w-3 h-3 ml-1" />
              </span>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
          <h2 className="text-lg font-bold">Live Kitchen Queue</h2>
          <a href="/admin/orders" className="text-sm text-blue-400 hover:text-blue-300">View All</a>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-white/5 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Order ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recentOrders.map((order, i) => (
                <tr key={i} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <span className="font-medium">{order.id}</span>
                    <div className="text-xs text-gray-500 mt-1">{order.time}</div>
                  </td>
                  <td className="px-6 py-4 text-gray-300">{order.customer} <span className="text-gray-500 text-xs ml-2">({order.items} items)</span></td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'Preparing' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' : 
                      order.status === 'Ready' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' : 
                      'bg-green-400/10 text-green-400 border-green-400/20'
                    }`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right font-medium">${order.total.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
