"use client";

import React, { useState, useEffect } from "react";
import { useCartStore } from "@/features/cart/store";
import { Plus, Search, Filter, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [menuItems, setMenuItems] = useState<any[]>([]);
  const addItem = useCartStore((state) => state.addItem);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    import("@/app/actions/menu").then(m => m.getLiveMenu().then(data => setMenuItems(data)));
  }, []);

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (selectedItem) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [selectedItem]);

  const MOCK_CATEGORIES = ["All", ...Array.from(new Set(menuItems.map(i => i.category?.name || "General")))];

  const filteredMenu = menuItems.filter((item) => {
    const matchesCategory = activeCategory === "All" || (item.category?.name || "General") === activeCategory;
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">Our <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">Menu</span></h1>
          <p className="text-gray-400">Carefully curated dishes from our award-winning culinary team.</p>
        </div>
        
        <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Search dishes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-white/30 text-sm transition-colors text-white"
            />
          </div>
          <button 
            onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
            className="flex items-center justify-center px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-sm text-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" /> Reset Filters
          </button>
        </div>
      </div>

      {/* Category Pills */}
      <div className="flex overflow-x-auto pb-4 mb-8 space-x-2 scrollbar-hide">
        {MOCK_CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap ${
              activeCategory === cat ? "bg-white text-black" : "bg-white/5 text-gray-300 hover:bg-white/10"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Menu Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredMenu.map((item, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={item.id} 
            layoutId={`card-${item.id}`}
            onClick={() => setSelectedItem(item)}
            className="group cursor-pointer relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="h-48 overflow-hidden relative">
                <motion.img layoutId={`image-${item.id}`} src={item.image || "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80"} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-medium border border-white/10 text-white">
                  ${Number(item.price).toFixed(2)}
                </div>
              </div>
              <div className="p-6 pb-2">
                <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{item.category?.name || "General"}</div>
                <motion.h3 layoutId={`title-${item.id}`} className="text-xl font-bold mb-2 text-gray-100">{item.name}</motion.h3>
                <p className="text-sm text-gray-400 line-clamp-2">{item.description}</p>
              </div>
            </div>
            <div className="p-6 pt-4">
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  addItem({
                    id: item.id,
                    name: item.name,
                    price: Number(item.price),
                    image: item.image
                  });
                }}
                className="w-full py-3 bg-white/5 border border-white/10 hover:bg-white text-gray-300 hover:text-black rounded-xl font-medium transition-colors flex items-center justify-center"
              >
                <Plus className="w-4 h-4 mr-2" /> Add to Cart
              </button>
            </div>
          </motion.div>
        ))}
      </div>
      
      {filteredMenu.length === 0 && (
        <div className="text-center py-20 text-gray-500">
          No dishes found matching your criteria.
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <React.Fragment>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedItem(null)}
              className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 md:p-6"
            />
            <motion.div
              layoutId={`card-${selectedItem.id}`}
              className="fixed inset-x-4 md:inset-x-auto md:w-full md:max-w-3xl md:h-[600px] top-1/2 -translate-y-1/2 bg-zinc-900 border border-white/10 rounded-3xl overflow-hidden z-50 flex flex-col md:flex-row mx-auto shadow-2xl"
            >
              <button 
                onClick={() => setSelectedItem(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 text-white rounded-full hover:bg-black/80 transition-colors z-10 backdrop-blur-md"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-full md:w-1/2 h-64 md:h-full relative">
                <motion.img 
                  layoutId={`image-${selectedItem.id}`} 
                  src={selectedItem.image || "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80"} 
                  alt={selectedItem.name} 
                  className="w-full h-full object-cover" 
                />
              </div>
              
              <div className="w-full md:w-1/2 p-8 md:p-10 flex flex-col justify-between bg-zinc-900">
                <div>
                  <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{selectedItem.category?.name || "General"}</div>
                  <motion.h3 layoutId={`title-${selectedItem.id}`} className="text-3xl md:text-4xl font-bold mb-4 text-white">
                    {selectedItem.name}
                  </motion.h3>
                  <p className="text-3xl font-light text-gray-300 mb-6">
                    ${Number(selectedItem.price).toFixed(2)}
                  </p>
                  <div className="h-px w-full bg-white/10 mb-6" />
                  <p className="text-gray-400 text-sm leading-relaxed mb-8 max-h-32 overflow-y-auto pr-2 scrollbar-hide">
                    {selectedItem.description}
                  </p>
                </div>
                
                <button 
                  onClick={() => {
                    addItem({
                      id: selectedItem.id,
                      name: selectedItem.name,
                      price: Number(selectedItem.price),
                      image: selectedItem.image
                    });
                    setSelectedItem(null);
                  }}
                  className="w-full py-4 bg-white text-black hover:bg-gray-200 rounded-xl font-bold transition-colors flex items-center justify-center text-lg"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add to Cart
                </button>
              </div>
            </motion.div>
          </React.Fragment>
        )}
      </AnimatePresence>
    </div>
  );
}
