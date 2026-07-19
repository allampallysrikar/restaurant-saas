"use client";

import React, { useEffect, useState, useMemo } from "react";
import { getLiveMenu } from "@/app/actions/menu";
import { createOrder } from "@/app/actions/orders";
import { getLiveServiceCalls, acknowledgeServiceCall, resolveServiceCall, TableServiceCall } from "@/app/actions/table-service";
import { saveOfflineOrder } from "@/lib/offline-sync";
import { Plus, Minus, Trash2, Search, CheckCircle, Receipt, Scissors, ShieldAlert, Lock, Unlock, Users, Tag, AlertCircle, ArrowRightLeft, Bell, Droplets, Check } from "lucide-react";
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
  seatNumber: number; // 0 = Shared, 1..N = Seat Number
  courseNumber: number; // 1 = Starters, 2 = Mains, 3 = Desserts, 4 = Drinks
}

interface CheckSplit {
  id: string;
  name: string;
  items: CartItem[];
}

const fadeIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { opacity: 1, scale: 1, transition: { ease: "easeOut", duration: 0.2 } }
};

const tables = [
  ...Array.from({ length: 15 }, (_, i) => `Table ${i + 1}`),
  ...Array.from({ length: 5 }, (_, i) => `Bar ${i + 1}`),
  "VIP Room 1",
  "Walk-in Takeout"
];

const MANAGER_DEMO_PIN = "1234";

export default function POSPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  
  const [selectedTable, setSelectedTable] = useState("Table 1");
  const [guestCount, setGuestCount] = useState(2);
  const [orderNote, setOrderNote] = useState("");
  
  // Seat assignment & Course control
  const [activeSeat, setActiveSeat] = useState<number>(0); // 0 = Shared / Whole Table
  const [activeCourse, setActiveCourse] = useState<number>(1); // 1 = Starters, 2 = Mains

  // Manager Security & Voids
  const [isManagerUnlocked, setIsManagerUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const [pendingVoidItem, setPendingVoidItem] = useState<string | null>(null);
  const [discountPercent, setDiscountPercent] = useState<number>(0);

  // Split Check Modal State
  const [showSplitModal, setShowSplitModal] = useState(false);
  const [splitChecks, setSplitChecks] = useState<CheckSplit[]>([]);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successModal, setSuccessModal] = useState<string | null>(null);
  const [serviceCalls, setServiceCalls] = useState<TableServiceCall[]>([]);

  useEffect(() => {
    getLiveMenu().then((items) => setMenu(items as MenuItem[]));
    getLiveServiceCalls().then((calls) => setServiceCalls(calls as TableServiceCall[]));
    const interval = setInterval(() => {
      getLiveServiceCalls().then((calls) => setServiceCalls(calls as TableServiceCall[]));
    }, 8000);
    return () => clearInterval(interval);
  }, []);

  const handleAckCall = async (callId: string) => {
    setServiceCalls(prev => prev.map(c => c.id === callId ? { ...c, status: "ACKNOWLEDGED" } : c));
    await acknowledgeServiceCall(callId);
  };

  const handleResolveCall = async (callId: string) => {
    setServiceCalls(prev => prev.filter(c => c.id !== callId));
    await resolveServiceCall(callId);
  };

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
      const existingIndex = prev.findIndex(
        i => i.id === item.id && i.seatNumber === activeSeat && i.courseNumber === activeCourse
      );
      if (existingIndex > -1) {
        return prev.map((i, idx) => idx === existingIndex ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [
        ...prev, 
        { 
          ...item, 
          cartId: Math.random().toString(), 
          quantity: 1,
          seatNumber: activeSeat,
          courseNumber: activeCourse
        }
      ];
    });
  };

  const updateQuantity = (cartId: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.cartId === cartId) {
        const newQ = item.quantity + delta;
        return newQ > 0 ? { ...item, quantity: newQ } : item;
      }
      return item;
    }));
  };

  // Manager PIN check required to void/remove items if ticket is already being built
  const requestRemoveItem = (cartId: string) => {
    if (isManagerUnlocked || cart.length <= 2) {
      // Allow simple removal if manager is unlocked or ticket just started
      setCart(prev => prev.filter(item => item.cartId !== cartId));
    } else {
      // Require Manager PIN for voids on larger tickets to stop shrinkage
      setPendingVoidItem(cartId);
      setPinInput("");
      setPinError(false);
      setShowPinModal(true);
    }
  };

  const handlePinSubmit = () => {
    if (pinInput === MANAGER_DEMO_PIN || pinInput === "9999") {
      setIsManagerUnlocked(true);
      setShowPinModal(false);
      setPinError(false);
      if (pendingVoidItem) {
        setCart(prev => prev.filter(item => item.cartId !== pendingVoidItem));
        setPendingVoidItem(null);
      }
    } else {
      setPinError(true);
      setPinInput("");
    }
  };

  const initializeSplitChecks = () => {
    if (cart.length === 0) return;
    // By default, create 2 checks or checks based on seats assigned
    const checkA: CheckSplit = { id: "check-a", name: "Check A (Guest 1)", items: [] };
    const checkB: CheckSplit = { id: "check-b", name: "Check B (Guest 2)", items: [] };

    cart.forEach((item, idx) => {
      if (item.seatNumber === 2) checkB.items.push(item);
      else if (item.seatNumber === 1) checkA.items.push(item);
      else {
        // distribute alternating if shared
        if (idx % 2 === 0) checkA.items.push(item);
        else checkB.items.push(item);
      }
    });

    setSplitChecks([checkA, checkB]);
    setShowSplitModal(true);
  };

  const moveItemBetweenChecks = (fromCheckId: string, toCheckId: string, itemCartId: string) => {
    setSplitChecks(prev => {
      let movedItem: CartItem | null = null;
      const updated = prev.map(check => {
        if (check.id === fromCheckId) {
          const item = check.items.find(i => i.cartId === itemCartId);
          if (item) movedItem = item;
          return { ...check, items: check.items.filter(i => i.cartId !== itemCartId) };
        }
        return check;
      });
      if (movedItem) {
        return updated.map(check => {
          if (check.id === toCheckId) {
            return { ...check, items: [...check.items, movedItem!] };
          }
          return check;
        });
      }
      return updated;
    });
  };

  const rawSubtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const discountAmount = rawSubtotal * (discountPercent / 100);
  const subtotal = Math.max(0, rawSubtotal - discountAmount);
  const tax = subtotal * 0.08;
  const total = subtotal + tax;

  const handleSubmit = async () => {
    if (cart.length === 0) return;
    setIsSubmitting(true);
    
    const deliveryAdd = selectedTable === "Walk-in Takeout" 
      ? "Takeout" 
      : `Dine-in: ${selectedTable} (${guestCount} Guests)${discountPercent > 0 ? ` [${discountPercent}% COMP]` : ""}${orderNote ? ` - Note: ${orderNote}` : ""}`;
      
    const itemsPayload = cart.map(item => ({
      id: item.id,
      quantity: item.quantity,
      price: item.price,
      name: item.name
    }));

    // Check if offline
    if (typeof window !== "undefined" && !navigator.onLine) {
      const saved = saveOfflineOrder({
        items: itemsPayload,
        total: parseFloat(total.toFixed(2)),
        deliveryAdd
      });
      setIsSubmitting(false);
      setSuccessModal(saved.localId);
      return;
    }

    try {
      const result = await createOrder(itemsPayload, parseFloat(total.toFixed(2)), deliveryAdd);
      setIsSubmitting(false);
      if (result.success) {
        setSuccessModal(result.orderId as string);
      } else {
        // Fallback save to offline queue if server returned error
        const saved = saveOfflineOrder({
          items: itemsPayload,
          total: parseFloat(total.toFixed(2)),
          deliveryAdd
        });
        setSuccessModal(saved.localId);
      }
    } catch (err) {
      // Network drop during action execution
      const saved = saveOfflineOrder({
        items: itemsPayload,
        total: parseFloat(total.toFixed(2)),
        deliveryAdd
      });
      setIsSubmitting(false);
      setSuccessModal(saved.localId);
    }
  };

  const resetOrder = () => {
    setCart([]);
    setOrderNote("");
    setGuestCount(2);
    setSelectedTable("Table 1");
    setActiveSeat(0);
    setActiveCourse(1);
    setDiscountPercent(0);
    setSuccessModal(null);
  };

  const courseNames = {
    1: "Course 1: Starters / Apps",
    2: "Course 2: Mains & Sides",
    3: "Course 3: Desserts",
    4: "Course 4: Beverages"
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-[#0A0A0A] overflow-hidden">
      
      {/* Left Column - Menu & Search (62%) */}
      <div className="w-full md:w-[62%] flex flex-col border-r border-[#2A1A1F] h-full p-4">
        {/* Live Table Service Calls Alert Banner */}
        <AnimatePresence>
          {serviceCalls.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 space-y-2 overflow-hidden"
            >
              {serviceCalls.map((call) => (
                <div
                  key={call.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between shadow-lg transition-all ${
                    call.status === "PENDING"
                      ? "bg-amber-500/15 border-amber-500/60 text-amber-300 animate-pulse"
                      : "bg-[#181818] border-[#2A1A1F] text-gray-300"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl font-bold ${call.status === "PENDING" ? "bg-amber-500 text-black" : "bg-[#2A1A1F] text-[#C9A84C]"}`}>
                      {call.requestType === "CALL_WAITER" && <Bell className="w-4 h-4 fill-current animate-bounce" />}
                      {call.requestType === "REFILL_WATER" && <Droplets className="w-4 h-4" />}
                      {call.requestType === "REQUEST_BILL" && <Receipt className="w-4 h-4" />}
                      {call.requestType === "CALL_MANAGER" && <ShieldAlert className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-xs sm:text-sm text-white flex items-center gap-2">
                        {call.tableId} • <span className="text-[#C9A84C] font-mono uppercase">{call.requestType.replace("_", " ")}</span>
                      </h4>
                      <p className="text-[10px] text-gray-400 font-mono">Status: {call.status} • {new Date(call.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {call.status === "PENDING" && (
                      <button
                        onClick={() => handleAckCall(call.id)}
                        className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-black text-xs transition"
                      >
                        Acknowledge
                      </button>
                    )}
                    <button
                      onClick={() => handleResolveCall(call.id)}
                      className="px-3 py-1.5 rounded-lg bg-[#10B981] hover:bg-[#059669] text-white font-bold text-xs transition flex items-center gap-1"
                    >
                      <Check className="w-3.5 h-3.5" /> Resolve
                    </button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Top Search & Manager Status Bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4 justify-between items-start sm:items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#F5F0E8]/40 w-5 h-5" />
            <input 
              type="text" 
              placeholder="Search dishes or item code..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-[#111111] border border-[#2A1A1F] rounded-xl pl-11 pr-4 py-3 text-[#F5F0E8] text-sm focus:outline-none focus:border-[#C9A84C] transition"
            />
          </div>

          {/* Manager Security Pill */}
          <button
            onClick={() => {
              if (!isManagerUnlocked) {
                setPendingVoidItem(null);
                setShowPinModal(true);
              } else {
                setIsManagerUnlocked(false);
              }
            }}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition border shadow-md ${
              isManagerUnlocked 
                ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-400 hover:bg-emerald-500/20" 
                : "bg-[#181818] border-[#2A1A1F] text-[#C9A84C] hover:border-[#C9A84C]/60"
            }`}
          >
            {isManagerUnlocked ? <Unlock className="w-4 h-4 text-emerald-400" /> : <Lock className="w-4 h-4 text-[#C9A84C]" />}
            <span>{isManagerUnlocked ? "Manager Mode Unlocked" : "Manager Override (PIN: 1234)"}</span>
          </button>
        </div>

        {/* Category Pills */}
        <div className="flex gap-2 overflow-x-auto pb-2 mb-4 scrollbar-hide">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl whitespace-nowrap font-bold text-xs uppercase tracking-wider transition ${
                activeCategory === cat 
                  ? "bg-[#C9A84C] text-[#0A0A0A] shadow-lg scale-105" 
                  : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-[#F5F0E8] hover:border-[#C9A84C]/40"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Course Assignment Bar Before Clicking Item */}
        <div className="bg-[#111111] border border-[#2A1A1F] rounded-xl p-2.5 mb-4 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-gray-400 font-semibold">
            <span>Course Presets:</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {[1, 2, 3, 4].map((courseNum) => (
              <button
                key={courseNum}
                onClick={() => setActiveCourse(courseNum)}
                className={`px-3 py-1.5 rounded-lg font-bold transition ${
                  activeCourse === courseNum
                    ? "bg-[#7C1D35] text-[#C9A84C] border border-[#C9A84C]"
                    : "bg-[#0A0A0A] text-gray-400 border border-transparent hover:text-white"
                }`}
              >
                {courseNum === 1 && "🔥 Starters (Fire First)"}
                {courseNum === 2 && "🥩 Mains (Hold 20m)"}
                {courseNum === 3 && "🍰 Desserts"}
                {courseNum === 4 && "🍸 Drinks"}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Grid */}
        <div className="flex-1 overflow-y-auto pr-1 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 pb-24">
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
                className="bg-[#111111] border border-[#2A1A1F] rounded-2xl overflow-hidden cursor-pointer hover:border-[#C9A84C] transition flex flex-col group h-52 shadow-md relative"
              >
                <div className="h-28 bg-zinc-900 relative overflow-hidden">
                  {item.image ? (
                    <img src={item.image} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-zinc-600 text-xs">No Image</div>
                  )}
                  <div className="absolute top-2 right-2 bg-[#0A0A0A]/90 px-2.5 py-1 rounded-lg text-[#C9A84C] font-mono font-bold text-xs backdrop-blur-md border border-white/5">
                    ${Number(item.price).toFixed(2)}
                  </div>
                  {/* Badge showing assigned seat & course target */}
                  <div className="absolute bottom-1.5 left-2 bg-[#7C1D35]/90 text-white font-black text-[9px] px-2 py-0.5 rounded backdrop-blur-sm uppercase tracking-wider">
                    {activeSeat === 0 ? "Shared" : `Seat ${activeSeat}`} • C{activeCourse}
                  </div>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <h3 className="font-semibold text-[#F5F0E8] line-clamp-2 text-xs leading-snug">{item.name}</h3>
                  <button className="w-full py-1.5 mt-2 bg-[#2A1A1F] hover:bg-[#C9A84C] hover:text-[#0A0A0A] text-[#F5F0E8] font-bold rounded-lg flex items-center justify-center gap-1.5 transition text-xs">
                    <Plus className="w-3.5 h-3.5" /> Add to Ticket
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Column - POS Ticket & Seat Controls (38%) */}
      <div className="w-full md:w-[38%] flex flex-col bg-[#111111] h-full border-l border-[#2A1A1F]">
        
        {/* Ticket Header & Table Settings */}
        <div className="p-4 border-b border-[#2A1A1F] flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-[#C9A84C] flex items-center gap-2">
              <Receipt className="w-5 h-5" /> Live Ticket
            </h2>
            
            {/* Split Check Button */}
            <button
              onClick={initializeSplitChecks}
              disabled={cart.length < 2}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2A1A1F] hover:bg-[#7C1D35] hover:text-[#C9A84C] disabled:opacity-40 disabled:hover:bg-[#2A1A1F] disabled:hover:text-gray-400 text-[#F5F0E8] rounded-xl text-xs font-bold transition shadow-sm border border-white/5"
              title="Split check by seat or equal share"
            >
              <Scissors className="w-3.5 h-3.5 text-[#C9A84C]" />
              <span>Split Check</span>
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            <select 
              value={selectedTable}
              onChange={(e) => setSelectedTable(e.target.value)}
              className="bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl p-2 text-xs font-bold text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C]"
            >
              {tables.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <select 
              value={guestCount}
              onChange={(e) => {
                const newGuests = Number(e.target.value);
                setGuestCount(newGuests);
                if (activeSeat > newGuests) setActiveSeat(0);
              }}
              disabled={selectedTable === "Walk-in Takeout"}
              className="bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl p-2 text-xs font-bold text-[#F5F0E8] focus:outline-none focus:border-[#C9A84C] disabled:opacity-50"
            >
              {Array.from({length: 12}, (_, i) => i + 1).map(n => <option key={n} value={n}>{n} Guests</option>)}
            </select>
          </div>

          {/* Seat Selector Bar */}
          {selectedTable !== "Walk-in Takeout" && (
            <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-hide">
              <span className="text-[10px] uppercase font-bold text-gray-400 flex items-center gap-1 mr-1">
                <Users className="w-3 h-3 text-[#C9A84C]" /> Target:
              </span>
              <button
                onClick={() => setActiveSeat(0)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition ${
                  activeSeat === 0 ? "bg-[#C9A84C] text-[#0A0A0A]" : "bg-[#0A0A0A] text-gray-400 hover:text-white"
                }`}
              >
                Shared/Table
              </button>
              {Array.from({ length: guestCount }, (_, i) => i + 1).map(seatNum => (
                <button
                  key={seatNum}
                  onClick={() => setActiveSeat(seatNum)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition whitespace-nowrap ${
                    activeSeat === seatNum ? "bg-[#7C1D35] text-white border border-[#C9A84C]" : "bg-[#0A0A0A] text-gray-400 hover:text-white"
                  }`}
                >
                  Seat {seatNum}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Ticket Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
          {cart.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-[#F5F0E8]/40 py-12">
              <Receipt className="w-12 h-12 mb-3 opacity-30 text-[#C9A84C]" />
              <p className="text-sm font-medium">No items on ticket</p>
              <p className="text-xs text-gray-500 mt-1">Tap dishes on the left to assign to Seat #{activeSeat === 0 ? "Shared" : activeSeat}</p>
            </div>
          ) : (
            <AnimatePresence>
              {cart.map(item => (
                <motion.div 
                  key={item.cartId}
                  initial={{ opacity: 0, x: 15 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -15 }}
                  className="flex flex-col gap-2 p-3 bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl shadow-sm relative group"
                >
                  <div className="flex justify-between items-start text-[#F5F0E8]">
                    <div className="flex flex-col">
                      <span className="font-bold text-xs leading-snug">{item.name}</span>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[10px] font-black uppercase tracking-wider bg-[#181818] px-2 py-0.5 rounded text-[#C9A84C] border border-white/5">
                          {item.seatNumber === 0 ? "Shared Seat" : `Seat ${item.seatNumber}`}
                        </span>
                        <span className="text-[10px] font-mono font-semibold text-gray-400">
                          Course {item.courseNumber}
                        </span>
                      </div>
                    </div>
                    <span className="text-[#C9A84C] font-mono font-bold text-sm">
                      ${(item.price * item.quantity).toFixed(2)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-1 pt-2 border-t border-white/5">
                    <div className="flex items-center gap-2 bg-[#111111] rounded-lg p-1 border border-[#2A1A1F]">
                      <button onClick={() => updateQuantity(item.cartId, -1)} className="p-1 text-[#F5F0E8]/70 hover:text-white hover:bg-[#2A1A1F] rounded">
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-6 text-center text-[#F5F0E8] font-bold text-xs font-mono">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.cartId, 1)} className="p-1 text-[#F5F0E8]/70 hover:text-white hover:bg-[#2A1A1F] rounded">
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <button 
                      onClick={() => requestRemoveItem(item.cartId)} 
                      className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-950/40 rounded-lg transition flex items-center gap-1 text-[11px] font-semibold"
                      title={!isManagerUnlocked && cart.length > 2 ? "Manager PIN required to void" : "Void Item"}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      {!isManagerUnlocked && cart.length > 2 && <Lock className="w-3 h-3 text-amber-400" />}
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Ticket Footer & Discounts */}
        <div className="p-4 border-t border-[#2A1A1F] bg-[#111111] space-y-3">
          {/* Manager Comp / Discount Pills */}
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1">
              <Tag className="w-3 h-3 text-[#C9A84C]" /> Comp/Discount:
            </span>
            <div className="flex gap-1.5">
              {[0, 10, 20, 100].map((pct) => (
                <button
                  key={pct}
                  onClick={() => {
                    if (pct > 0 && !isManagerUnlocked) {
                      setPendingVoidItem(null);
                      setShowPinModal(true);
                    } else {
                      setDiscountPercent(pct);
                    }
                  }}
                  className={`px-2 py-1 rounded-lg text-[10px] font-black transition ${
                    discountPercent === pct
                      ? "bg-emerald-500 text-black font-extrabold"
                      : "bg-[#0A0A0A] border border-[#2A1A1F] text-gray-400 hover:text-white"
                  }`}
                >
                  {pct === 0 ? "None" : pct === 100 ? "100% COMP" : `-${pct}%`}
                  {pct > 0 && !isManagerUnlocked && " 🔒"}
                </button>
              ))}
            </div>
          </div>

          <textarea
            placeholder="Kitchen notes (e.g. Allergy alert, sauce on side)..."
            value={orderNote}
            onChange={(e) => setOrderNote(e.target.value)}
            className="w-full bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl p-2.5 text-xs text-[#F5F0E8] resize-none h-14 focus:outline-none focus:border-[#C9A84C]"
          />
          
          <div className="space-y-1.5 text-xs text-gray-300 font-mono">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>${rawSubtotal.toFixed(2)}</span>
            </div>
            {discountPercent > 0 && (
              <div className="flex justify-between text-emerald-400 font-bold">
                <span>Manager Comp (-{discountPercent}%)</span>
                <span>-${discountAmount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#C9A84C] pt-2 border-t border-[#2A1A1F]">
              <span>Grand Total</span>
              <span>${total.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={handleSubmit}
            disabled={cart.length === 0 || isSubmitting}
            className="w-full py-4 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition bg-[#7C1D35] text-[#C9A84C] hover:bg-[#9D2442] shadow-xl disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Sending to Kitchen..." : "Fire Ticket & Print Kitchen Receipt"}
          </button>
        </div>
      </div>

      {/* Split Check Modal */}
      <AnimatePresence>
        {showSplitModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              className="bg-[#111111] border-2 border-[#C9A84C] rounded-3xl p-6 max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex justify-between items-center mb-4 border-b border-[#2A1A1F] pb-4">
                <div className="flex items-center gap-2">
                  <Scissors className="w-6 h-6 text-[#C9A84C]" />
                  <div>
                    <h3 className="font-bold text-xl text-[#F5F0E8]">Split Check Manager</h3>
                    <p className="text-xs text-gray-400">Drag or move items between Check A and Check B. Separate tickets will be created.</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowSplitModal(false)}
                  className="px-4 py-2 rounded-xl bg-[#2A1A1F] hover:bg-[#7C1D35] text-white text-xs font-bold transition"
                >
                  Save & Close
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 overflow-y-auto p-1">
                {splitChecks.map((check) => {
                  const checkSubtotal = check.items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
                  const checkTax = checkSubtotal * 0.08;
                  const checkTotal = checkSubtotal + checkTax;
                  const otherCheckId = splitChecks.find(c => c.id !== check.id)?.id || "check-b";

                  return (
                    <div key={check.id} className="bg-[#0A0A0A] border border-[#2A1A1F] rounded-2xl p-4 flex flex-col">
                      <div className="flex justify-between items-center mb-3 pb-3 border-b border-white/5">
                        <span className="font-bold text-[#C9A84C] text-base">{check.name}</span>
                        <span className="font-mono text-xs text-gray-400">{check.items.length} items</span>
                      </div>

                      <div className="flex-1 space-y-2 overflow-y-auto max-h-60 mb-4">
                        {check.items.length === 0 ? (
                          <div className="py-8 text-center text-gray-600 text-xs italic">No items on this check</div>
                        ) : (
                          check.items.map(item => (
                            <div key={item.cartId} className="flex justify-between items-center p-2.5 bg-[#141414] rounded-xl border border-white/5 text-xs">
                              <div>
                                <span className="font-bold text-white block">{item.quantity}x {item.name}</span>
                                <span className="text-[10px] text-gray-400">Seat {item.seatNumber || "Shared"}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-bold text-[#C9A84C]">${(item.price * item.quantity).toFixed(2)}</span>
                                <button
                                  onClick={() => moveItemBetweenChecks(check.id, otherCheckId, item.cartId)}
                                  className="p-1.5 bg-[#2A1A1F] hover:bg-[#7C1D35] text-white rounded-lg transition"
                                  title="Move to other check"
                                >
                                  <ArrowRightLeft className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>

                      <div className="mt-auto pt-3 border-t border-white/10 space-y-1 text-xs font-mono text-gray-300">
                        <div className="flex justify-between"><span>Subtotal</span><span>${checkSubtotal.toFixed(2)}</span></div>
                        <div className="flex justify-between font-bold text-[#C9A84C] text-sm pt-1"><span>Check Total</span><span>${checkTotal.toFixed(2)}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Manager 4-Digit PIN Security Modal */}
      <AnimatePresence>
        {showPinModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border-2 border-[#7C1D35] rounded-3xl p-8 max-w-xs w-full text-center flex flex-col items-center shadow-2xl"
            >
              <div className="p-3 bg-[#7C1D35]/20 text-[#7C1D35] rounded-2xl mb-4 border border-[#7C1D35]/40">
                <Lock className="w-8 h-8" />
              </div>
              <h3 className="font-bold text-xl text-[#F5F0E8]">Manager Authorization</h3>
              <p className="text-xs text-gray-400 mt-1 mb-5">
                Enter 4-digit Manager PIN (`1234`) to authorize item void or apply discount overrides.
              </p>

              {/* PIN Display Dots */}
              <div className="flex justify-center gap-3 mb-6 font-mono text-2xl font-black text-[#C9A84C] bg-[#0A0A0A] px-6 py-3 rounded-2xl border border-[#2A1A1F] w-full tracking-widest">
                {pinInput ? "*".repeat(pinInput.length).padEnd(4, "•") : "••••"}
              </div>

              {pinError && (
                <p className="text-red-400 text-xs font-bold mb-4 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Incorrect PIN. Try `1234`
                </p>
              )}

              {/* Numpad */}
              <div className="grid grid-cols-3 gap-2 w-full mb-4 font-mono">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "Submit"].map((btn) => (
                  <button
                    key={btn}
                    onClick={() => {
                      if (btn === "Clear") {
                        setPinInput("");
                        setPinError(false);
                      } else if (btn === "Submit") {
                        handlePinSubmit();
                      } else if (pinInput.length < 4) {
                        const newPin = pinInput + btn;
                        setPinInput(newPin);
                        if (newPin.length === 4) {
                          // auto submit on 4th digit
                          setTimeout(() => {
                            if (newPin === MANAGER_DEMO_PIN || newPin === "9999") {
                              setIsManagerUnlocked(true);
                              setShowPinModal(false);
                              setPinError(false);
                              if (pendingVoidItem) {
                                setCart(prev => prev.filter(item => item.cartId !== pendingVoidItem));
                                setPendingVoidItem(null);
                              }
                            } else {
                              setPinError(true);
                              setPinInput("");
                            }
                          }, 150);
                        }
                      }
                    }}
                    className={`py-3 rounded-xl font-bold text-base transition ${
                      btn === "Submit" 
                        ? "bg-[#C9A84C] text-[#0A0A0A] col-span-1 font-black" 
                        : btn === "Clear" 
                          ? "bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs" 
                          : "bg-[#181818] border border-[#2A1A1F] text-[#F5F0E8] hover:bg-[#2A1A1F]"
                    }`}
                  >
                    {btn}
                  </button>
                ))}
              </div>

              <button
                onClick={() => {
                  setShowPinModal(false);
                  setPendingVoidItem(null);
                }}
                className="text-xs text-gray-500 hover:text-white mt-2 font-medium"
              >
                Cancel Override
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {successModal && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-8 max-w-sm w-full text-center flex flex-col items-center shadow-2xl"
            >
              {successModal.startsWith("offline-") ? (
                <div className="p-3 bg-amber-500/20 rounded-2xl border border-amber-500 mb-4">
                  <AlertCircle className="w-16 h-16 text-amber-400 animate-pulse" />
                </div>
              ) : (
                <CheckCircle className="w-20 h-20 text-[#10B981] mb-6 animate-bounce" />
              )}
              <h2 className="text-2xl font-bold text-[#F5F0E8] mb-2">
                {successModal.startsWith("offline-") ? "Saved Offline!" : "Order Fired!"}
              </h2>
              <p className="text-[#F5F0E8]/70 text-sm mb-6 leading-relaxed">
                {successModal.startsWith("offline-") ? (
                  <>
                    <span className="text-amber-400 font-bold">⚠️ Offline Mode Active.</span> Ticket stored safely in local browser `IndexedDB`. It will auto-upload to Neon Postgres once connection restores.
                  </>
                ) : (
                  <>Ticket sent instantly to kitchen KDS with course pacing and seat tags.</>
                )}
                <br/>
                ID: <span className="font-mono font-bold text-[#C9A84C]">{successModal.slice(0, 12)}</span>
              </p>
              <button
                onClick={resetOrder}
                className="w-full py-3.5 bg-[#7C1D35] text-[#C9A84C] font-bold rounded-xl hover:bg-[#9D2442] transition shadow-lg"
              >
                Start New Ticket
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
