"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, CheckCircle, AlertCircle, Mail, Phone, ArrowRight, User, Info } from "lucide-react";
import { createReservation, getBookedSlots } from "@/app/actions/reservations";

export default function ReservationsPage() {
  const [formData, setFormData] = useState({
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    date: "",
    time: "19:00",
    guestsCount: 2,
    specialReq: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>("");

  useEffect(() => {
    if (formData.date) {
      getBookedSlots(formData.date).then(slots => setBookedSlots(slots));
    } else {
      setBookedSlots([]);
    }
  }, [formData.date]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.guestName || !formData.guestEmail || !formData.date || !formData.time) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    const payload = {
      ...formData,
      specialReq: selectedTable ? `[Selected Table: ${selectedTable}] ${formData.specialReq}` : formData.specialReq
    };

    const res = await createReservation(payload);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Failed to make reservation. Please try again.");
    }
  };

  const timeSlots = ["12:00", "13:00", "14:00", "19:00", "20:00", "21:00", "21:30"];
  const formatTime = (time24: string) => {
    const [h, m] = time24.split(":");
    const hours = parseInt(h);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    return `${hours12}:${m} ${ampm}`;
  };

  const tables = [
    { id: "W1", label: "W1 - Window", seats: "2-4", type: "window", x: 10, y: 10 },
    { id: "W2", label: "W2 - Window", seats: "2-4", type: "window", x: 10, y: 35 },
    { id: "W3", label: "W3 - Window", seats: "2-4", type: "window", x: 10, y: 60 },
    { id: "W4", label: "W4 - Window", seats: "2-4", type: "window", x: 10, y: 85 },
    { id: "M1", label: "M1 - Main Booth", seats: "4-6", type: "booth", x: 40, y: 20 },
    { id: "M2", label: "M2 - Main Booth", seats: "4-6", type: "booth", x: 40, y: 50 },
    { id: "M3", label: "M3 - Main Booth", seats: "4-6", type: "booth", x: 40, y: 80 },
    { id: "C1", label: "C1 - Chef's Counter", seats: "1-2", type: "counter", x: 70, y: 30 },
    { id: "C2", label: "C2 - Chef's Counter", seats: "1-2", type: "counter", x: 70, y: 50 },
    { id: "C3", label: "C3 - Chef's Counter", seats: "1-2", type: "counter", x: 70, y: 70 },
    { id: "VIP-1", label: "VIP-1 - Private Room", seats: "Up to 10", type: "vip", x: 80, y: 10, width: 25, height: 15 },
  ];

  if (success) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex items-center justify-center px-6 py-24 bg-[url('https://images.unsplash.com/photo-1514933651103-005eec06c04b?auto=format&fit=crop&q=80')] bg-cover bg-center bg-blend-overlay bg-black/80">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-[#111111]/90 backdrop-blur-xl border border-[#2A1A1F] rounded-3xl p-10 text-center shadow-2xl"
        >
          <div className="w-20 h-20 bg-[#7C1D35]/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#7C1D35]/30">
            <CheckCircle className="w-10 h-10 text-[#C9A84C]" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-4xl font-bold mb-4 text-[#F5F0E8]">Table Reserved</h2>
          <p className="text-gray-400 mb-8 leading-relaxed">
            We look forward to hosting you. Your reservation for <span className="text-[#C9A84C] font-semibold">{formData.guestsCount} guests</span> on <span className="text-[#C9A84C] font-semibold">{formData.date}</span> at <span className="text-[#C9A84C] font-semibold">{formatTime(formData.time)}</span> is confirmed.
          </p>
          <div className="p-6 bg-[#0A0A0A] rounded-2xl mb-8 text-left text-sm space-y-4 border border-[#2A1A1F]">
            <div className="flex justify-between"><span className="text-gray-500">Name</span> <span className="text-[#F5F0E8] font-medium">{formData.guestName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email</span> <span className="text-[#F5F0E8] font-medium">{formData.guestEmail}</span></div>
            {formData.specialReq && <div className="flex justify-between"><span className="text-gray-500">Notes</span> <span className="text-[#F5F0E8] font-medium max-w-[60%] text-right">{formData.specialReq}</span></div>}
          </div>
          <button
            onClick={() => { setSuccess(false); setFormData({ guestName: "", guestEmail: "", guestPhone: "", date: "", time: "19:00", guestsCount: 2, specialReq: "" }); }}
            className="w-full py-4 bg-[#C9A84C] text-[#0A0A0A] font-bold rounded-xl hover:bg-white transition shadow-lg"
          >
            Book Another Table
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex flex-col relative">
      <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80')] bg-cover bg-center opacity-30 mix-blend-luminosity"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-[#0A0A0A]"></div>
      
      <div className="flex-1 w-full flex items-center justify-center px-6 py-24 relative z-10">
        <div className="max-w-2xl w-full">
          <div className="text-center mb-12">
            <h1 className="font-[family-name:var(--font-playfair)] text-5xl md:text-7xl font-bold tracking-tight mb-4 text-[#F5F0E8] drop-shadow-lg">
              Reserve Your Table
            </h1>
            <p className="text-gray-300 max-w-lg mx-auto text-lg drop-shadow-md">
              Experience culinary excellence in an intimate, modern ambiance.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-[#111111]/80 backdrop-blur-xl border border-[#2A1A1F] rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            {error && (
              <div className="mb-8 p-4 bg-red-900/20 border border-red-500/30 rounded-2xl flex items-center text-red-400 text-sm">
                <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div className="mb-10 bg-black/40 p-6 rounded-2xl border border-[#2A1A1F]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-[family-name:var(--font-playfair)] text-2xl text-[#F5F0E8]">Select Your Table <span className="text-sm font-sans text-gray-500 ml-2">(Optional)</span></h3>
                <div className="flex gap-4 text-xs font-bold text-gray-400">
                  <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#111111] border border-[#2A1A1F] mr-1"></div> Available</span>
                  <span className="flex items-center"><div className="w-3 h-3 rounded-full bg-[#7C1D35]/30 border border-[#C9A84C] mr-1"></div> Selected</span>
                </div>
              </div>
              
              <div className="relative w-full h-[300px] bg-[#111111] border border-[#2A1A1F] rounded-xl overflow-hidden mb-4">
                {/* Kitchen Area */}
                <div className="absolute right-0 top-0 bottom-0 w-[20%] bg-[#2A1A1F]/30 border-l border-[#2A1A1F] flex items-center justify-center">
                  <span className="text-[#C9A84C] font-bold text-sm tracking-widest rotate-90 whitespace-nowrap">KITCHEN & BAR</span>
                </div>
                
                {/* Tables */}
                {tables.map((t) => {
                  const isSelected = selectedTable === t.label;
                  return (
                    <button
                      key={t.id}
                      onClick={() => setSelectedTable(isSelected ? "" : t.label)}
                      style={{ 
                        left: `${t.x}%`, 
                        top: `${t.y}%`,
                        width: t.width ? `${t.width}%` : '10%',
                        height: t.height ? `${t.height}%` : '10%',
                        transform: 'translate(-50%, -50%)'
                      }}
                      className={`absolute rounded-lg border-2 flex items-center justify-center transition-all text-xs font-bold shadow-lg
                        ${isSelected 
                          ? "border-[#C9A84C] bg-[#7C1D35]/50 text-[#C9A84C] shadow-[#C9A84C]/20 scale-110 z-10" 
                          : "border-[#2A1A1F] bg-[#0A0A0A] text-gray-500 hover:border-gray-500 hover:text-gray-300"
                        }
                        ${t.type === 'window' ? 'rounded-l-full' : ''}
                        ${t.type === 'booth' ? 'rounded-2xl' : ''}
                        ${t.type === 'counter' ? 'rounded-sm' : ''}
                      `}
                    >
                      {t.id}
                    </button>
                  );
                })}
              </div>
              {selectedTable && (
                <div className="text-sm text-[#C9A84C] bg-[#7C1D35]/10 border border-[#7C1D35]/30 rounded-lg p-3 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2" /> Selected: <strong className="ml-1">{selectedTable}</strong>
                </div>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Guest Name</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="text"
                      required
                      value={formData.guestName}
                      onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                      placeholder="John Doe"
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] placeholder-gray-600 transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                    <input
                      type="email"
                      required
                      value={formData.guestEmail}
                      onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] placeholder-gray-600 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    <input
                      type="date"
                      required
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] transition [color-scheme:dark]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Time</label>
                  <div className="relative">
                    <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 pointer-events-none" />
                    <select
                      value={formData.time}
                      onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                      className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] transition appearance-none"
                    >
                      {timeSlots.map(slot => (
                        <option key={slot} value={slot} disabled={bookedSlots.includes(slot)}>
                          {formatTime(slot)} {bookedSlots.includes(slot) ? "(Fully Booked)" : ""}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Guests</label>
                  <div className="relative flex items-center bg-black/50 border border-[#2A1A1F] rounded-xl focus-within:border-[#C9A84C] focus-within:ring-1 focus-within:ring-[#C9A84C] transition">
                    <Users className="absolute left-4 w-5 h-5 text-gray-500 pointer-events-none" />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, guestsCount: Math.max(1, formData.guestsCount - 1) })}
                      className="absolute left-10 p-2 text-gray-400 hover:text-[#C9A84C]"
                    >
                      -
                    </button>
                    <input 
                      type="number"
                      min={1} max={10}
                      readOnly
                      value={formData.guestsCount}
                      className="w-full text-center py-3.5 bg-transparent border-none focus:outline-none text-[#F5F0E8] font-medium"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, guestsCount: Math.min(10, formData.guestsCount + 1) })}
                      className="absolute right-4 p-2 text-gray-400 hover:text-[#C9A84C]"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="tel"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    placeholder="+1 (555) 000-0000"
                    className="w-full pl-12 pr-4 py-3.5 bg-black/50 border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] placeholder-gray-600 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-[#C9A84C] uppercase tracking-widest mb-2">Special Requests</label>
                <textarea
                  rows={3}
                  value={formData.specialReq}
                  onChange={(e) => setFormData({ ...formData, specialReq: e.target.value })}
                  placeholder="Allergies, anniversary celebration, seating preferences..."
                  className="w-full px-4 py-3.5 bg-black/50 border border-[#2A1A1F] rounded-xl focus:outline-none focus:border-[#C9A84C] focus:ring-1 focus:ring-[#C9A84C] text-[#F5F0E8] placeholder-gray-600 transition resize-none"
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-[#7C1D35] text-[#F5F0E8] font-bold rounded-xl hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition shadow-lg disabled:opacity-50 flex items-center justify-center text-lg mt-4 group"
              >
                {loading ? (
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    Confirm Reservation <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
