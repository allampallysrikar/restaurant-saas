"use client";

import React, { useState, useEffect } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminMenuPage() {
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [search, setSearch] = useState("");
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<"add" | "edit">("add");
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    categoryId: "",
    image: ""
  });
  
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const menuActions = await import("@/app/actions/menu");
    const adminActions = await import("@/app/actions/admin-menu");
    
    const items = await menuActions.getLiveMenu();
    setMenuItems(items);
    
    const cats = await adminActions.getCategories();
    setCategories(cats);
    if (cats.length > 0) {
      setFormData(prev => ({ ...prev, categoryId: cats[0].id }));
    }
  };

  const toggleAvailability = async (id: string, currentStatus: boolean) => {
    setMenuItems(menuItems.map(item => item.id === id ? { ...item, isAvailable: !currentStatus } : item));
    const m = await import("@/app/actions/menu");
    await m.toggleMenuItemAvailability(id, !currentStatus);
  };

  const openAddModal = () => {
    setModalMode("add");
    setEditingId(null);
    setFormData({
      name: "",
      description: "",
      price: "",
      categoryId: categories.length > 0 ? categories[0].id : "",
      image: ""
    });
    setIsModalOpen(true);
  };

  const openEditModal = (item: any) => {
    setModalMode("edit");
    setEditingId(item.id);
    setFormData({
      name: item.name,
      description: item.description || "",
      price: item.price.toString(),
      categoryId: item.categoryId,
      image: item.image || ""
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const adminActions = await import("@/app/actions/admin-menu");
    
    if (modalMode === "add") {
      await adminActions.createMenuItem(formData);
    } else if (modalMode === "edit" && editingId) {
      await adminActions.updateMenuItem(editingId, formData);
    }
    
    setIsModalOpen(false);
    fetchData();
  };

  const confirmDelete = async () => {
    if (itemToDelete) {
      const adminActions = await import("@/app/actions/admin-menu");
      await adminActions.deleteMenuItem(itemToDelete);
      setIsDeleteAlertOpen(false);
      setItemToDelete(null);
      fetchData();
    }
  };

  const filteredItems = menuItems.filter(i => i.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h1 className="text-3xl font-bold mb-2">Menu Management</h1>
          <p className="text-gray-400">Add, edit, or remove items from your live restaurant menu.</p>
        </div>
        <button onClick={openAddModal} className="flex items-center px-6 py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 transition">
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
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 text-sm"
            />
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-black/20 text-gray-400 text-sm">
              <tr>
                <th className="px-6 py-4 font-medium">Image</th>
                <th className="px-6 py-4 font-medium">Item Name</th>
                <th className="px-6 py-4 font-medium">Category</th>
                <th className="px-6 py-4 font-medium">Price</th>
                <th className="px-6 py-4 font-medium">Availability</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredItems.map((item, i) => (
                <motion.tr 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  key={item.id} 
                  className="hover:bg-white/5 transition-colors"
                >
                  <td className="px-6 py-4">
                    <div className="w-12 h-12 rounded-lg bg-white/10 overflow-hidden">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-medium text-white">{item.name}</td>
                  <td className="px-6 py-4 text-gray-400">{item.category?.name}</td>
                  <td className="px-6 py-4 font-medium">${Number(item.price).toFixed(2)}</td>
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
                      <button onClick={() => openEditModal(item)} className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-lg transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => { setItemToDelete(item.id); setIsDeleteAlertOpen(true); }} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-lg"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">{modalMode === "add" ? "Add Menu Item" : "Edit Menu Item"}</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
              </div>
              
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                  <textarea value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 resize-none" rows={3}></textarea>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Price</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
                    <select required value={formData.categoryId} onChange={e => setFormData({...formData, categoryId: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30 [color-scheme:dark]">
                      <option value="">Select Category</option>
                      {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">Image URL</label>
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="w-full px-4 py-2 bg-black/50 border border-white/10 rounded-lg focus:outline-none focus:border-white/30" />
                </div>
                
                <div className="pt-4 flex justify-end space-x-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">Save Item</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      
      {/* Delete Alert */}
      <AnimatePresence>
        {isDeleteAlertOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-zinc-900 border border-white/10 rounded-2xl p-6 w-full max-w-sm text-center"
            >
              <Trash2 className="w-12 h-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-xl font-bold mb-2">Delete Item?</h2>
              <p className="text-gray-400 mb-6">This action cannot be undone. Are you sure you want to delete this menu item?</p>
              <div className="flex justify-center space-x-3">
                <button onClick={() => setIsDeleteAlertOpen(false)} className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">Cancel</button>
                <button onClick={confirmDelete} className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white font-medium rounded-lg transition-colors">Delete</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
