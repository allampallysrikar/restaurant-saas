"use client";

import React from "react";
import { Check, X, Clock, Printer, Download } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminOrdersPage() {
  const [orders, setOrders] = React.useState<any[]>([]);

  React.useEffect(() => {
    import("@/app/actions/orders").then(m => m.getLiveOrders().then(data => setOrders(data)));
  }, []);

  const updateStatus = async (id: string, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
    const m = await import("@/app/actions/orders");
    await m.updateOrderStatus(id, status);
  };

  const exportToCSV = () => {
    if (orders.length === 0) return;
    const headers = ["Order ID", "Date", "Status", "Total Amount", "Items"];
    const rows = orders.map(order => [
      order.id,
      new Date(order.createdAt).toLocaleString(),
      order.status,
      order.totalAmount.toFixed(2),
      order.items.map((i: any) => `${i.quantity}x ${i.menuItem.name}`).join(" | ")
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `orders_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Order Management</h1>
          <p className="text-gray-400">Live kitchen queue and order processing.</p>
        </div>
        <button onClick={exportToCSV} className="flex items-center px-4 py-2 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition">
          <Download className="w-4 h-4 mr-2" /> Export CSV
        </button>
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
                    <h3 className="text-lg font-bold">{order.id.slice(-8).toUpperCase()}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                      order.status === 'PREPARING' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' : 
                      order.status === 'READY' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' : 
                      'bg-yellow-400/10 text-yellow-400 border-yellow-400/20'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{order.userId || "Guest"} • {new Date(order.createdAt).toLocaleTimeString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold">${order.totalAmount.toFixed(2)}</p>
                  <p className="text-xs text-gray-500">Paid Demo Checkout</p>
                </div>
              </div>

              <div className="mb-6">
                <ul className="space-y-2">
                  {order.items.map((item: any, idx: number) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-gray-300"><span className="text-gray-500 mr-2">{item.quantity}x</span> {item.menuItem.name}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3">
                <button onClick={() => updateStatus(order.id, "READY")} className="flex-1 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition flex items-center justify-center">
                  <Check className="w-4 h-4 mr-2" /> Mark Ready
                </button>
                <button onClick={() => updateStatus(order.id, "DELIVERED")} className="px-4 py-2 bg-white/5 border border-white/10 text-white rounded-lg hover:bg-white/10 transition">
                  <Printer className="w-4 h-4" /> Delivered
                </button>
                <button onClick={() => updateStatus(order.id, "CANCELLED")} className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg hover:bg-red-500 hover:text-white transition">
                  <X className="w-4 h-4" /> Cancel
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
