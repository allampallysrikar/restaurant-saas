"use client";

import React, { useState } from "react";
import { useCartStore } from "@/features/cart/store";
import { Minus, Plus, Trash2, ArrowRight, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items, updateQuantity, removeItem, total, clearCart } = useCartStore();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  const cartTotal = total();
  const tax = cartTotal * 0.08; // 8% tax mock
  const finalTotal = cartTotal + tax;

  if (!mounted) return null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    // Simulate Razorpay mock payment delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Call server action to create order
    const { createOrder } = await import("@/app/actions/orders");
    const res = await createOrder(
      items.map(i => ({ id: i.id, quantity: i.quantity, price: i.price })),
      finalTotal
    );

    if (res.success) {
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
      <div className="min-h-screen flex items-center justify-center p-6 text-center">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="max-w-md w-full bg-white/5 border border-white/10 p-10 rounded-3xl">
          <div className="w-20 h-20 bg-green-500/20 text-green-400 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShieldCheck className="w-10 h-10" />
          </div>
          <h2 className="text-3xl font-bold mb-4">Order Confirmed!</h2>
          <p className="text-gray-400 mb-8">Your payment was successful. The kitchen has started preparing your culinary experience.</p>
          <a href="/menu" className="block w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-gray-200 transition-colors">
            Back to Menu
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-12">Your <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">Cart</span></h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-white/10 rounded-3xl bg-white/5">
          <p className="text-gray-400 text-lg mb-6">Your cart is currently empty.</p>
          <a href="/menu" className="inline-flex items-center px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-gray-200 transition">
            Explore Menu <ArrowRight className="ml-2 w-4 h-4" />
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
                  className="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white/5 border border-white/10 rounded-2xl"
                >
                  <div className="w-full sm:w-24 h-24 rounded-xl overflow-hidden bg-white/10 shrink-0">
                    {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                  </div>
                  
                  <div className="flex-1 w-full text-center sm:text-left">
                    <h3 className="text-lg font-bold text-gray-100">{item.name}</h3>
                    <p className="text-primary font-medium text-gray-400">${item.price}</p>
                  </div>

                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 bg-white/5 rounded-full p-2 border border-white/10">
                    <div className="flex items-center space-x-4 px-2">
                      <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="text-gray-400 hover:text-white transition">
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="font-medium w-4 text-center">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-gray-400 hover:text-white transition">
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="p-2 text-red-400 hover:bg-red-400/10 rounded-full transition-colors mr-1">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="w-full lg:w-1/3">
            <div className="bg-white/5 border border-white/10 rounded-3xl p-8 sticky top-24">
              <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-8 text-sm">
                <div className="flex justify-between text-gray-400">
                  <span>Subtotal</span>
                  <span className="text-white">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Taxes (8%)</span>
                  <span className="text-white">${tax.toFixed(2)}</span>
                </div>
                <div className="h-px bg-white/10 my-4"></div>
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span>${finalTotal.toFixed(2)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-white text-black rounded-xl font-medium hover:bg-gray-200 transition-colors flex items-center justify-center disabled:opacity-70"
              >
                {isCheckingOut ? (
                  <span className="animate-pulse">Processing Payment...</span>
                ) : (
                  <>
                    <CreditCard className="w-5 h-5 mr-2" /> Pay ${finalTotal.toFixed(2)}
                  </>
                )}
              </button>
              
              <p className="text-xs text-gray-500 text-center mt-6 flex items-center justify-center">
                <ShieldCheck className="w-3 h-3 mr-1" /> Demo checkout — no real payment processed.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
