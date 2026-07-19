"use client";

import Link from "next/link";
import { motion } from "framer-motion";

export default function NotFound() {
  return (
    <div className="bg-[#0A0A0A] text-[#F5F0E8] min-h-screen flex items-center justify-center pt-20">
      <div className="text-center px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="font-playfair text-9xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-[#C9A84C] to-[#7C1D35] mb-6">
            404
          </h1>
          <h2 className="font-playfair text-4xl mb-4">Table Not Found</h2>
          <p className="text-[#F5F0E8]/70 font-light text-lg mb-10 max-w-md mx-auto">
            It seems this page has left the menu. Let us guide you back to our main selections.
          </p>
          <Link 
            href="/" 
            className="inline-block bg-[#7C1D35] text-[#C9A84C] px-10 py-4 uppercase tracking-widest text-sm hover:bg-[#5A1224] transition-colors border border-transparent hover:border-[#C9A84C]"
          >
            Back to Home
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
