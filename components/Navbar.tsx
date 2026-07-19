"use client";

import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { CartBadge } from "./CartBadge";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav 
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${
          scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/10 py-3" : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6 flex items-center justify-between">
          <a href="/" className="font-bold text-2xl tracking-tight text-white z-50">
            XYZ Restaurant.
          </a>
          
          {/* Desktop Nav */}
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium text-gray-300">
            <a href="/menu" className="hover:text-white transition-colors">Menu</a>
            <a href="/reservations" className="hover:text-white transition-colors">Reservations</a>
            <a href="/profile" className="hover:text-white transition-colors">Points</a>
            <CartBadge />
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden flex items-center gap-4 z-50">
            <CartBadge />
            <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
              {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed inset-0 z-40 bg-black/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 text-xl font-medium"
          >
            <a href="/menu" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">Menu</a>
            <a href="/reservations" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">Reservations</a>
            <a href="/profile" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">Points</a>
            <a href="/admin" onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition-colors">Admin</a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
