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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    import("@/app/actions/menu").then(m => m.getLiveMenu().then(data => {
      setMenuItems(data);
      setLoading(false);
    }));
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
    <div className="bg-[#0A0A0A] text-[#F5F0E8] min-h-screen pb-24 relative overflow-hidden">
      {/* Subtle background image/pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80')", backgroundSize: 'cover', backgroundPosition: 'center', mixBlendMode: 'overlay' }}></div>
      
      <div className="container mx-auto px-6 pt-32 pb-12 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold tracking-tight mb-4">
              Our <span className="underline decoration-[#C9A84C] decoration-4 underline-offset-8">Menu</span>
            </h1>
            <p className="text-gray-400 max-w-xl text-lg">Carefully curated dishes from our award-winning culinary team, prepared with the finest seasonal ingredients.</p>
          </div>
          
          <div className="w-full md:w-auto flex flex-col sm:flex-row gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input 
                type="text" 
                placeholder="Search dishes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#111111] border border-[#2A1A1F] rounded-full focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-sm transition-all text-[#F5F0E8] placeholder-gray-500 shadow-inner"
              />
            </div>
            <button 
              onClick={() => { setActiveCategory("All"); setSearchQuery(""); }}
              className="flex items-center justify-center px-6 py-3 bg-[#111111] border border-[#2A1A1F] rounded-full hover:border-[#C9A84C] transition-colors text-sm text-[#C9A84C]"
            >
              <Filter className="w-4 h-4 mr-2" /> Reset
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex overflow-x-auto pb-6 mb-8 space-x-3 scrollbar-hide">
          {MOCK_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-8 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap border tracking-wide ${
                activeCategory === cat 
                  ? "bg-[#7C1D35] text-[#C9A84C] border-[#7C1D35] shadow-lg shadow-[#7C1D35]/20" 
                  : "bg-[#111111] text-gray-400 border-[#2A1A1F] hover:border-[#C9A84C]/50 hover:text-[#F5F0E8]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-[#111111] border border-[#2A1A1F] overflow-hidden animate-pulse">
                <div className="h-56 bg-white/5"></div>
                <div className="p-6">
                  <div className="h-3 w-1/4 bg-white/10 rounded mb-4"></div>
                  <div className="h-6 w-3/4 bg-white/10 rounded mb-2"></div>
                  <div className="h-4 w-full bg-white/5 rounded mb-1"></div>
                  <div className="h-4 w-2/3 bg-white/5 rounded mt-4"></div>
                  <div className="h-12 w-full bg-white/10 rounded-xl mt-6"></div>
                </div>
              </div>
            ))
          ) : filteredMenu.map((item, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={item.id} 
              layoutId={`card-${item.id}`}
              onClick={() => setSelectedItem(item)}
              className="group cursor-pointer relative rounded-2xl overflow-hidden bg-[#111111] border border-[#2A1A1F] hover:border-[#C9A84C]/50 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="h-56 overflow-hidden relative">
                  <motion.img layoutId={`image-${item.id}`} src={item.image || "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80"} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent opacity-60"></div>
                  <div className="absolute top-4 right-4 px-4 py-1.5 bg-[#C9A84C] rounded-full text-xs font-bold text-[#0A0A0A] shadow-lg">
                    ${Number(item.price).toFixed(2)}
                  </div>
                </div>
                <div className="p-6 pb-2 relative z-10 -mt-8">
                  <div className="text-[10px] text-[#C9A84C] font-bold uppercase tracking-widest mb-2 drop-shadow-md">{item.category?.name || "General"}</div>
                  <motion.h3 layoutId={`title-${item.id}`} className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-3 text-[#F5F0E8] leading-tight group-hover:text-[#C9A84C] transition-colors">{item.name}</motion.h3>
                  <p className="text-sm text-gray-400 line-clamp-2 leading-relaxed">{item.description}</p>
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
                  className="w-full py-3.5 bg-white/5 border border-[#2A1A1F] group-hover:bg-[#7C1D35] group-hover:border-[#7C1D35] text-[#F5F0E8] rounded-xl font-medium transition-all flex items-center justify-center"
                >
                  <Plus className="w-5 h-5 mr-2" /> Add to Cart
                </button>
              </div>
            </motion.div>
          ))}
        </div>
        
        {!loading && filteredMenu.length === 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-32">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#111111] border border-[#2A1A1F] flex items-center justify-center mb-6">
              <svg className="w-8 h-8 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
            </div>
            <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#C9A84C] mb-2">No dishes found</h3>
            <p className="text-gray-500">Try adjusting your filters or search query.</p>
          </motion.div>
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
                className="fixed inset-0 bg-[#0A0A0A]/90 backdrop-blur-md z-50 flex items-center justify-center p-4 md:p-6"
              />
              <motion.div
                layoutId={`card-${selectedItem.id}`}
                className="fixed inset-x-4 md:inset-x-auto md:w-full md:max-w-4xl md:h-[650px] top-1/2 -translate-y-1/2 bg-[#111111] border border-[#2A1A1F] rounded-3xl overflow-hidden z-50 flex flex-col md:flex-row mx-auto shadow-2xl"
              >
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="absolute top-4 right-4 p-2.5 bg-[#7C1D35] text-[#F5F0E8] rounded-full hover:bg-white hover:text-[#7C1D35] transition-colors z-10 shadow-lg"
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
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#111111] hidden md:block"></div>
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111111] to-transparent md:hidden"></div>
                </div>
                
                <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-between relative z-10">
                  <div>
                    <div className="text-xs text-[#C9A84C] font-bold uppercase tracking-widest mb-4">{selectedItem.category?.name || "General"}</div>
                    <motion.h3 layoutId={`title-${selectedItem.id}`} className="font-[family-name:var(--font-playfair)] text-4xl md:text-5xl font-bold mb-6 text-[#F5F0E8] leading-tight">
                      {selectedItem.name}
                    </motion.h3>
                    <p className="font-[family-name:var(--font-playfair)] text-3xl italic text-[#C9A84C] mb-8">
                      ${Number(selectedItem.price).toFixed(2)}
                    </p>
                    <div className="h-px w-full bg-gradient-to-r from-[#2A1A1F] via-[#2A1A1F] to-transparent mb-8" />
                    <p className="text-gray-400 text-base leading-relaxed mb-8 max-h-40 overflow-y-auto pr-4 scrollbar-hide">
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
                    className="w-full py-5 bg-[#7C1D35] text-[#F5F0E8] hover:bg-[#C9A84C] hover:text-[#0A0A0A] rounded-xl font-bold transition-colors flex items-center justify-center text-lg shadow-lg shadow-[#7C1D35]/20"
                  >
                    <Plus className="w-6 h-6 mr-2" /> Add to Order
                  </button>
                </div>
              </motion.div>
            </React.Fragment>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
