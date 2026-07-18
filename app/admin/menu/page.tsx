"use client";

import React, { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);

  React.useEffect(() => {
    import("@/app/actions/menu").then(m => m.getLiveMenu().then(data => setMenuItems(data)));
  }, []);

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    // Optimistic update
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, isAvailable: !currentStatus } : item));
    const m = await import("@/app/actions/menu");
    await m.toggleMenuItemAvailability(id, !currentStatus);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-gray-400">Add, edit, or remove items from your live restaurant menu.</p>
        </div>
        <button className="flex items-center px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition">
          <Plus className="w-5 h-5 mr-2" /> Add Menu Item
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex justify-between items-center bg-white/5">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search menu items..."
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Availability</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {menuItems.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4 text-gray-400">{item.category?.name}</td>
                  <td className="px-6 py-4 font-medium">${item.price.toFixed(2)}</td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => toggleAvailability(item.id, item.isAvailable)}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${item.isAvailable ? 'bg-green-500' : 'bg-gray-600'}`}
                    >
                      <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${item.isAvailable ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end space-x-2">
                      <button className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
