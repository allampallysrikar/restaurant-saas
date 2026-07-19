"use client";

import React, { useEffect, use } from "react";
import Link from "next/link";
import { Utensils, ArrowRight } from "lucide-react";
import { motion, Variants } from "framer-motion";

const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

export default function TablePortalPage({ params }: { params: Promise<{ tableId: string }> }) {
  // App router dynamic params need to be unwrapped in React 19/Next 15 with `use()` but since Next 16 might be similar we can use React `use`
  const resolvedParams = use(params);
  const tableId = resolvedParams.tableId;

  const formattedTableName = tableId.toLowerCase() === "vip" ? "VIP Private Room" : `Table ${tableId}`;

  useEffect(() => {
    if (tableId) {
      localStorage.setItem("golden_fork_table", tableId);
    }
  }, [tableId]);

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-center relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-[#7C1D35]/20 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-[#C9A84C]/10 rounded-full blur-[120px]" />

      <motion.div 
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="max-w-md w-full z-10 bg-[#111111]/80 backdrop-blur-xl border border-[#2A1A1F] p-8 md:p-12 rounded-3xl shadow-2xl"
      >
        <motion.div variants={fadeInUp} className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[#2A1A1F] rounded-full flex items-center justify-center border border-[#C9A84C]/30">
            <Utensils className="w-10 h-10 text-[#C9A84C]" />
          </div>
        </motion.div>

        <motion.h1 variants={fadeInUp} className="font-serif text-3xl md:text-4xl text-[#C9A84C] font-bold mb-2">
          Welcome to
          <br />
          The Golden Fork
        </motion.h1>

        <motion.p variants={fadeInUp} className="text-[#F5F0E8]/70 text-lg mb-8">
          You are seated at <strong className="text-[#F5F0E8]">{formattedTableName}</strong>
        </motion.p>

        <motion.div variants={fadeInUp}>
          <Link 
            href={`/menu?table=${tableId}`}
            className="w-full py-4 px-6 bg-[#7C1D35] hover:bg-[#9D2442] text-[#C9A84C] font-bold text-lg rounded-xl flex items-center justify-center gap-3 transition group"
          >
            View Menu & Order Now
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>

        <motion.p variants={fadeInUp} className="text-sm text-[#F5F0E8]/40 mt-8">
          Your table number has been saved to your session.
        </motion.p>
      </motion.div>
    </div>
  );
}
