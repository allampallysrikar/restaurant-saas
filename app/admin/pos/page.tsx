"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getLiveMenu } from "@/app/actions/menu";
import { createOrder } from "@/app/actions/orders";
import { Plus, Minus, Trash2, Search, CheckCircle, Receipt } from "lucide-react";
import { motion, Variants, AnimatePresence } from "framer-motion";

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string | null;
  category: { id: string; name: string };
}

interface CartItem extends MenuItem {
  cartId: string;
  quantity: number;
}

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { ease: "easeOut", duration: 0.2 } }
};

const tables = [
  ...Array.from({ length: 15 }, (_, i) => `Table ${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Bar ${i + 1}`),
  "Walk-in Takeout"
];

export default function POSPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [selectedTable, setSelectedTable] = useState("Table 1");
  const [guestCount, setGuestCount] = useState(1);
  const [orderNote, setOrderNote] = useState("");
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<string | null>(null);

  useEffect(() => {
    getLiveMenu().then((items) => setMenu(items as MenuItem[]));
  }, []);

  const categories = ["All", ...Array.from(new Set(menu.map(item => item.category?.name || "Uncategorized")))];

  const filteredMenu = useMemo(() => {
    return menu.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCat = activeCategory === "All" || item.category?.name === activeCategory;
      return matchesSearch && matchesCat;
    });
  }, [menu, search, activeCategory]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, cartId: Math.random().toString(), quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    const deliveryAdd = selectedTable === "Walk-in Takeout" 
      ? "Takeout" 
      : `Dine-in: ${selectedTable} (Guests: ${guestCount})${orderNote ? ` - Note: ${orderNote}` : ""}`;
      
    const itemsPayload = cart.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    const result = await createOrder(itemsPayload, parseFloat(total.toFixed(2)), deliveryAdd);
    
    setIsSubmitting(false);
    if (result.success) {
      setSuccessModal(result.orderId as string);
    } else {
      alert("Failed to submit order");
    }
  };

  const resetOrder = () => {
    setCart([]);
    setOrderNote("");
    setGuestCount(1);
    setSelectedTable("Table 1");
    setSuccessModal(null);
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-[#0A0A0A] overflow-hidden">
      
      {/* Left Column - Menu (65%) */}
      <div className="w-full md:w-[65%] flex flex-col border-r border-[#2A1A1F] h-full p-4">
        <div className="flex gap-4 mb-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#F5F0E8]/50 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search menu..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111111] border border-[#2A1A1F] rounded-lg pl-10 pr-4 py-3 text-[#F5F0E8] focus:outline-none focus:border-[#7C1D35] transition"
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold transition ${
                activeCategory === cat 
                  ? "bg-[#C9A84C] text-[#111111]" 
                  : "bg-[#111111] border border-[#2A1A1F] text-[#F5F0E8] hover:border-[#C9A84C]/50"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto pr-2 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-20">
          <AnimatePresence>
            {filteredMenu.map(item => (
              <motion.div
                key={item.id}
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                layoutId={item.id}
                onClick={() => addToCart(item)}
                className="bg-[#111111] border border-[#2A1A1F] rounded-xl overflow-hidden cursor-pointer hover:border-[#C9A84C] transition flex flex-col group h-48"
              >
                <div className="h-24 bg-zinc-800 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-[#0A0A0A]/80 px-2 py-1 rounded text-[#C9A84C] font-bold text-sm backdrop-blur-sm">
                    ${item.price.toFixed(2)}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-[#F5F0E8] line-clamp-2 text-sm leading-tight">{item.name}</h3>
                  <button className="w-full py-1.5 mt-2 bg-[#2A1A1F] hover:bg-[#7C1D35] text-white rounded flex items-center justify-center transition">
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column - Cart (35%) */}
      <div className="w-full md:w-[35%] flex flex-col bg-[#111111] h-full">
        <div className="p-4 border-b border-[#2A1A1F] flex flex-col gap-4">
          <h2 className="text-xl font-bold text-[#C9A84C] flex items-center gap-2">
            <Receipt className="w-5 h-5" /> Current Ticket
          </h2>
          <div className="grid grid-cols-2 gap-3">
            <select 
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-[#0A0A0A] border border-[#2A1A1F] rounded-lg p-2 text-[#F5F0E8] focus:outline-none focus:border-[#7C1D35]"
            >
              {tables.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              value={guestCount}
              onChange={(e) => setGuestCount(Number(e.target.value))}
              disabled={selectedTable === "Walk-in Takeout"}
              className="bg-[#0A0A0A] border border-[#2A1A1F] rounded-lg p-2 text-[#F5F0E8] focus:outline-none focus:border-[#7C1D35] disabled:opacity-50"
            >
              {Array.from({length: 10}, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} Guests</option>)}
            </select>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#F5F0E8]/40">
              <Receipt className="w-12 h-12 mb-2 opacity-50" />
              <p>Ticket is empty</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map(item => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex flex-col gap-2 p-3 bg-[#0A0A0A] border border-[#2A1A1F] rounded-lg"
                >
                  <div className="flex justify-between text-[#F5F0E8]">
                    <span className="font-semibold">{item.name}</span>
                    <span className="text-[#C9A84C] font-bold">${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-3 bg-[#111111] rounded-lg p-1 border border-[#2A1A1F]">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 text-[#F5F0E8]/70 hover:text-white hover:bg-[#2A1A1F] rounded">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-6 text-center text-[#F5F0E8] font-bold">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 text-[#F5F0E8]/70 hover:text-white hover:bg-[#2A1A1F] rounded">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => removeFromCart(item.id)} className="p-2 text-red-400 hover:text-red-300 hover:bg-red-950/30 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        <div className="p-4 border-t border-[#2A1A1F] bg-[#111111] space-y-4">
          <textarea
            placeholder="Add order notes (e.g. Allergy info, less spicy)..."
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#2A1A1F] rounded-lg p-3 text-sm text-[#F5F0E8] resize-none h-20 focus:outline-none focus:border-[#7C1D35]"
          />
          
          <div className="space-y-2 text-sm text-[#F5F0E8]/80">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg font-bold text-[#C9A84C] pt-2 border-t border-[#2A1A1F]">
              <span>Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 transition bg-[#7C1D35] text-[#C9A84C] hover:bg-[#9D2442] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Submitting..." : "Submit Order & Print Ticket"}
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {successModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-[#2A1A1F] rounded-2xl p-8 max-w-sm w-full text-center flex flex-col items-center"
            >
              <CheckCircle className="w-20 h-20 text-[#10B981] mb-6" />
              <h2 className="text-2xl font-bold text-[#F5F0E8] mb-2">Order Confirmed!</h2>
              <p className="text-[#F5F0E8]/70 mb-6">
                Ticket printed successfully. <br/>
                Order ID: <span className="font-mono text-[#C9A84C]">{successModal.slice(0, 8)}</span>
              </p>
              <button
                onClick={resetOrder}
                className="w-full py-3 bg-[#7C1D35] text-[#C9A84C] font-bold rounded-lg hover:bg-[#9D2442] transition"
              >
                Start New Order
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
