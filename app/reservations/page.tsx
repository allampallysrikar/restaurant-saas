"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Users, CheckCircle, AlertCircle } from "lucide-react";
import { createReservation } from "@/app/actions/reservations";

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.guestName || !formData.guestEmail || !formData.date || !formData.time) {
      setError("Please fill out all required fields.");
      setLoading(false);
      return;
    }

    const res = await createReservation(formData);
    setLoading(false);

    if (res.success) {
      setSuccess(true);
    } else {
      setError(res.error || "Failed to make reservation. Please try again.");
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center px-6 py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center"
        >
          <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-6" />
          <h2 className="text-3xl font-bold mb-4">Table Reserved!</h2>
          <p className="text-gray-400 mb-6">
            We have received your reservation request for <span className="text-white font-medium">{formData.guestsCount} guests</span> on <span className="text-white font-medium">{formData.date}</span> at <span className="text-white font-medium">{formData.time}</span>.
          </p>
          <div className="p-4 bg-white/5 rounded-2xl mb-8 text-left text-sm space-y-2 border border-white/5">
            <div className="flex justify-between"><span className="text-gray-500">Name:</span> <span className="text-gray-300">{formData.guestName}</span></div>
            <div className="flex justify-between"><span className="text-gray-500">Email:</span> <span className="text-gray-300">{formData.guestEmail}</span></div>
            {formData.specialReq && <div className="flex justify-between"><span className="text-gray-500">Notes:</span> <span className="text-gray-300">{formData.specialReq}</span></div>}
          </div>
          <button
            onClick={() => { setSuccess(false); setFormData({ guestName: "", guestEmail: "", guestPhone: "", date: "", time: "19:00", guestsCount: 2, specialReq: "" }); }}
            className="w-full py-4 bg-white text-black font-semibold rounded-2xl hover:bg-gray-200 transition"
          >
            Book Another Table
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white px-6 py-24">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
            Reserve <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">Your Table</span>
          </h1>
          <p className="text-gray-400 max-w-xl mx-auto">
            Experience culinary excellence in an intimate, modern ambiance. Book online for instant table confirmation.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl backdrop-blur-md"
        >
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl flex items-center text-red-400 text-sm">
              <AlertCircle className="w-5 h-5 mr-3 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Guest Name *</label>
                <input
                  type="text"
                  required
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  placeholder="John Doe"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder-gray-500 transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email Address *</label>
                <input
                  type="email"
                  required
                  value={formData.guestEmail}
                  onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                  placeholder="john@example.com"
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder-gray-500 transition"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-gray-400" /> Date *
                </label>
                <input
                  type="date"
                  required
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 text-white transition [color-scheme:dark]"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-gray-400" /> Time *
                </label>
                <select
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 text-white transition [color-scheme:dark]"
                >
                  <option value="17:00">5:00 PM</option>
                  <option value="17:30">5:30 PM</option>
                  <option value="18:00">6:00 PM</option>
                  <option value="18:30">6:30 PM</option>
                  <option value="19:00">7:00 PM</option>
                  <option value="19:30">7:30 PM</option>
                  <option value="20:00">8:00 PM</option>
                  <option value="20:30">8:30 PM</option>
                  <option value="21:00">9:00 PM</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2 flex items-center">
                  <Users className="w-4 h-4 mr-2 text-gray-400" /> Guests *
                </label>
                <select
                  value={formData.guestsCount}
                  onChange={(e) => setFormData({ ...formData, guestsCount: Number(e.target.value) })}
                  className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 text-white transition [color-scheme:dark]"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((num) => (
                    <option key={num} value={num}>{num} {num === 1 ? "Guest" : "Guests"}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Phone Number</label>
              <input
                type="tel"
                value={formData.guestPhone}
                onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                placeholder="+1 (555) 000-0000"
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder-gray-500 transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Special Requests (Optional)</label>
              <textarea
                rows={3}
                value={formData.specialReq}
                onChange={(e) => setFormData({ ...formData, specialReq: e.target.value })}
                placeholder="Allergies, anniversary celebration, window seating preference..."
                className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl focus:outline-none focus:border-white/40 text-white placeholder-gray-500 transition resize-none"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-200 transition shadow-lg disabled:opacity-50 flex items-center justify-center text-base"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                "Confirm Table Reservation"
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}
