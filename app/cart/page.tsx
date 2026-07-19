"use client";

import React, { useState } from "react";
import { useCartStore } from "@/features/cart/store";
import { Minus, Plus, Trash2, ArrowRight, CreditCard, ShieldCheck, Tag, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  // Coupon state
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; type: 'percent' | 'flat'; value: number } | null>(null);
  const [couponError, setCouponError] = useState("");

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartTotal = total();
  const tax = cartTotal * 0.08; // 8% tax mock

  let discountAmount = 0;
  if (appliedCoupon) {
    if (appliedCoupon.type === 'percent') {
      discountAmount = cartTotal * (appliedCoupon.value / 100);
    } else {
      discountAmount = appliedCoupon.value;
    }
  }

  // Prevent negative total
  const finalTotal = Math.max(0, cartTotal - discountAmount + tax);

  if (!mounted) return null;

  const handleApplyCoupon = () => {
    setCouponError("");
    const code = couponCode.toUpperCase().trim();
    if (code === "SAVE10") {
      setAppliedCoupon({ code, type: 'percent', value: 10 });
    } else if (code === "WELCOME20") {
      setAppliedCoupon({ code, type: 'percent', value: 20 });
    } else if (code === "FLAT50") {
      setAppliedCoupon({ code, type: 'flat', value: 50 });
    } else {
      setAppliedCoupon(null);
      setCouponError("Invalid coupon code");
    }
  };

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate payment delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Call server action to create order
    const { createOrder } = await import("@/app/actions/orders");
    const res = await createOrder(
      items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
      finalTotal
    );

    if (res.success && res.orderId) {
      setOrderId(res.orderId);
      setIsCheckingOut(false);
      setPaymentSuccess(true);
      clearCart();
    } else {
      setIsCheckingOut(false);
      alert("Failed to process order.");
    }
  };

  if (paymentSuccess) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-[#111111] border border-[#2A1A1F] p-10 rounded-3xl shadow-2xl">
          <div className="w-20 h-20 bg-[#C9A84C]/10 text-[#C9A84C] rounded-full flex items-center justify-center mx-auto mb-6 border border-[#C9A84C]/30">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mb-4 text-[#F5F0E8]">Order Confirmed</h2>
          <p className="text-gray-400 mb-8">The kitchen has started preparing your culinary experience.</p>
          <div className="bg-[#0A0A0A] rounded-xl p-6 mb-8 border border-[#2A1A1F]">
            <p className="text-[#C9A84C] font-bold text-lg mb-1">✨ You earned {Math.floor(finalTotal)} points! ✨</p>
            <p className="text-xs text-gray-500">(1 point per $1 spent)</p>
          </div>
          <div className="space-y-4">
            <a href={`/order/${orderId}`} className="block w-full py-4 bg-[#7C1D35] text-[#F5F0E8] font-bold rounded-xl hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors shadow-lg">
              Track Your Order
            </a>
            <a href="/menu" className="block w-full py-4 bg-transparent border border-[#2A1A1F] text-[#F5F0E8] font-medium rounded-xl hover:border-[#C9A84C] hover:text-[#C9A84C] transition-colors">
              Return to Menu
            </a>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#0A0A0A] min-h-screen pb-24 pt-32">
      <div className="container mx-auto px-6 max-w-6xl">
        <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-6xl font-bold tracking-tight mb-12 text-[#F5F0E8]">
          Your <span className="underline decoration-[#C9A84C] decoration-4 underline-offset-8 text-[#C9A84C]">Order</span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-32 border border-[#2A1A1F] rounded-3xl bg-[#111111] shadow-xl">
            <div className="w-24 h-24 mx-auto rounded-full bg-[#0A0A0A] border border-[#2A1A1F] flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-[#C9A84C]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
            <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-4 text-[#F5F0E8]">Your table is empty</h2>
            <p className="text-gray-400 text-lg mb-8">Discover our exquisite dishes and add them to your order.</p>
            <a href="/menu" className="inline-flex items-center px-8 py-4 bg-[#C9A84C] text-[#0A0A0A] rounded-full font-bold hover:bg-white transition shadow-lg">
              Browse Menu <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="w-full lg:w-2/3 space-y-6">
              <AnimatePresence>
                {items.map((item) => (
                  <motion.div 
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    key={item.id} 
                    className="flex flex-col sm:flex-row items-center gap-6 p-6 bg-[#111111] border border-[#2A1A1F] rounded-2xl shadow-lg"
                  >
                    <div className="w-full sm:w-28 h-28 rounded-xl overflow-hidden bg-[#0A0A0A] shrink-0 border border-[#2A1A1F]">
                      {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                    </div>
                    
                    <div className="flex-1 w-full text-center sm:text-left">
                      <h3 className="font-[family-name:var(--font-playfair)] text-2xl font-bold text-[#F5F0E8] mb-2">{item.name}</h3>
                      <p className="font-bold text-[#C9A84C]">${Number(item.price).toFixed(2)}</p>
                    </div>

                    <div className="flex items-center justify-between w-full sm:w-auto gap-6 bg-[#0A0A0A] rounded-full p-2 border border-[#2A1A1F]">
                      <div className="flex items-center space-x-4 px-3">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-[#C9A84C] hover:text-white transition">
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="font-bold w-6 text-center text-[#F5F0E8]">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-[#C9A84C] hover:text-white transition">
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="p-2.5 text-red-400 hover:bg-[#7C1D35] hover:text-white rounded-full transition-colors mr-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Order Summary & Coupons */}
            <div className="w-full lg:w-1/3 space-y-6">
              {/* Coupon Code Section */}
              <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-8 shadow-xl">
                <h3 className="text-sm font-bold uppercase tracking-widest text-[#C9A84C] mb-4 flex items-center">
                  <Tag className="w-4 h-4 mr-2" /> Privileges
                </h3>
                <div className="flex gap-3">
                  <input 
                    type="text" 
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Enter code"
                    className="flex-1 px-4 py-3 bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] text-[#F5F0E8] text-sm"
                  />
                  <button 
                    onClick={handleApplyCoupon}
                    className="px-6 py-3 bg-[#2A1A1F] hover:bg-[#C9A84C] hover:text-[#0A0A0A] text-[#F5F0E8] rounded-xl text-sm font-bold transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-red-400 text-xs mt-3">{couponError}</p>}
                {appliedCoupon && <p className="text-[#C9A84C] text-xs mt-3 font-medium">✨ Privilege '{appliedCoupon.code}' accepted.</p>}
              </div>

              {/* Order Summary */}
              <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-8 sticky top-24 shadow-xl">
                <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-6 text-[#F5F0E8]">Summary</h2>
                
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex justify-between text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-[#F5F0E8] font-medium">${cartTotal.toFixed(2)}</span>
                  </div>
                  {appliedCoupon && (
                    <div className="flex justify-between text-[#C9A84C]">
                      <span>Discount ({appliedCoupon.code})</span>
                      <span>-${discountAmount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>Taxes (8%)</span>
                    <span className="text-[#F5F0E8] font-medium">${tax.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-[#2A1A1F] my-6"></div>
                  <div className="flex justify-between items-end">
                    <span className="text-gray-400 uppercase tracking-widest text-xs font-bold">Grand Total</span>
                    <span className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#C9A84C]">${finalTotal.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="w-full py-4 bg-[#7C1D35] text-[#C9A84C] rounded-xl font-bold hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors flex items-center justify-center disabled:opacity-70 shadow-lg"
                >
                  {isCheckingOut ? (
                    <span className="animate-pulse">Processing...</span>
                  ) : (
                    <>
                      <Lock className="w-5 h-5 mr-2" /> Place Order
                    </>
                  )}
                </button>
                
                <p className="text-xs text-gray-500 text-center mt-6 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4 mr-1" /> Secure checkout processing
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
