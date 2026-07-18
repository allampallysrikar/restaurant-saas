"use client";

import React, { useState } from "react";
import { useCartStore } from "@/features/cart/store";
import { Plus, Search, Filter } from "lucide-react";
import { motion } from "framer-motion";

const MOCK_CATEGORIES = ["All", "Starters", "Mains", "Desserts", "Beverages"];
const MOCK_MENU = [
  { id: "1", name: "Truffle Arancini", description: "Crispy risotto balls with black truffle and mozzarella.", price: 18, category: "Starters", image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80" },
  { id: "2", name: "Wagyu Ribeye", description: "A5 Grade Wagyu beef with roasted root vegetables.", price: 85, category: "Mains", image: "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=500&q=80" },
  { id: "3", name: "Lobster Ravioli", description: "Handmade pasta stuffed with fresh lobster in saffron cream sauce.", price: 34, category: "Mains", image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80" },
  { id: "4", name: "Matcha Tiramisu", description: "Traditional Italian dessert with a Japanese twist.", price: 14, category: "Desserts", image: "https://images.unsplash.com/photo-1571115177098-24de63f25c27?w=500&q=80" },
];

export default function MenuPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const addItem = useCartStore((state) => state.addItem);

  const filteredMenu = MOCK_MENU.filter((item) => {
    const matchesCategory = activeCategory === "All" || item.category === activeCategory;
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
              className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-full focus:outline-none focus:border-white/30 text-sm transition-colors"
            />
          </div>
          <button className="flex items-center justify-center px-4 py-2 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 transition-colors text-sm">
            <Filter className="w-4 h-4 mr-2" /> Filters
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
            className="group relative rounded-2xl overflow-hidden bg-white/5 border border-white/10 hover:border-white/20 transition-all"
          >
            <div className="h-48 overflow-hidden relative">
              <img src={item.image} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute top-4 right-4 px-3 py-1 bg-black/70 backdrop-blur-md rounded-full text-xs font-medium border border-white/10">
                ${item.price}
              </div>
            </div>
            <div className="p-6">
              <div className="text-xs text-gray-500 uppercase tracking-wider mb-2">{item.category}</div>
              <h3 className="text-xl font-bold mb-2 text-gray-100">{item.name}</h3>
              <p className="text-sm text-gray-400 line-clamp-2 mb-6">{item.description}</p>
              
              <button 
                onClick={() => addItem(item)}
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
    </div>
  );
}
