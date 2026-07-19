"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminLogin() {
  const [email, setEmail] = useState("admin@xyz.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (data.success) {
        router.push("/admin");
        router.refresh();
      } else {
        setError(data.error || "Invalid credentials");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-6 text-[#F5F0E8] relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-10"></div>
      
      <div className="mb-10 text-center relative z-10">
        <h1 className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#F5F0E8]">
          The <span className="text-[#C9A84C]">Golden</span> Fork
        </h1>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-[#111111]/90 backdrop-blur-xl border border-[#2A1A1F] rounded-3xl p-10 shadow-2xl relative z-10"
      >
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#2A1A1F] flex items-center justify-center rounded-full mx-auto mb-4 border border-[#C9A84C]/20">
            <Lock className="w-7 h-7 text-[#C9A84C]" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-2">Admin Portal</h2>
          <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl flex items-center text-red-400 text-sm">
            <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] placeholder-gray-600 transition"
                placeholder="admin@xyz.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-2">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] placeholder-gray-600 transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-[#7C1D35] text-[#F5F0E8] font-bold rounded-xl hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors flex items-center justify-center group shadow-lg"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                Sign In <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
