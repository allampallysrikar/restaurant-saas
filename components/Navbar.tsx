"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Menu", href: "/menu" },
    { name: "About", href: "/about" },
    { name: "Reservations", href: "/reservations" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b border-[#C9A84C]/20 ${
        scrolled ? "bg-black/90 backdrop-blur-md py-4" : "bg-black py-6"
      }`}
    >
      <div className="container mx-auto px-6 md:px-12 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 z-50">
          <span className="font-playfair text-2xl text-white tracking-wide">
            The Golden Fork
          </span>
          <svg className="w-5 h-5 text-gold" fill="currentColor" viewBox="0 0 24 24">
            <path d="M11 2v9.36l-2 1.34V22h-1v-9.3l-2-1.34V2h1v7.6l1.5-1V2h1v5.6l1.5 1V2h1zM16 2v10c0 2.2-1.8 4-4 4v6h-1v-6c-2.8 0-5-2.2-5-5V2h1v9c0 2.2 1.8 4 4 4s4-1.8 4-4V2h1z"/>
          </svg>
        </Link>

        {/* Desktop Links */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-cream text-sm uppercase tracking-widest hover:text-gold transition-colors duration-200"
            >
              {link.name}
            </Link>
          ))}
        </div>

        {/* Right side (Desktop) */}
        <div className="hidden md:flex items-center gap-6">
          <button className="text-cream hover:text-gold transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
            </svg>
          </button>
          <Link
            href="/reservations"
            className="bg-burgundy text-white px-6 py-2 rounded-sm text-sm uppercase tracking-widest hover:bg-[#5A1224] transition-colors duration-300 border border-transparent hover:border-gold"
          >
            Book a Table
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-cream z-50"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 right-0 bg-black border-b border-[#C9A84C]/20 shadow-xl md:hidden"
          >
            <div className="flex flex-col items-center py-8 gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-cream text-lg uppercase tracking-widest hover:text-gold transition-colors duration-200"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="/reservations"
                onClick={() => setMobileMenuOpen(false)}
                className="bg-burgundy text-white px-8 py-3 mt-4 rounded-sm text-sm uppercase tracking-widest"
              >
                Book a Table
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
