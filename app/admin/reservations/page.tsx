"use client";

import React, { useState, useEffect } from "react";
import { getLiveReservations, updateReservationStatus } from "@/app/actions/reservations";
import { Calendar, Clock, Users, Check, X, Phone, Mail } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    const data = await getLiveReservations();
    setReservations(data);
    setLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    setReservations(reservations.map(r => r.id === id ? { ...r, status: newStatus } : r));
    await updateReservationStatus(id, newStatus);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight mb-2">Table Reservations</h1>
          <p className="text-gray-400">Manage incoming booking requests from customers.</p>
        </div>
        <button
          onClick={fetchReservations}
          className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm hover:bg-white/10 transition"
        >
          Refresh Bookings
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-gray-500">Loading reservations...</div>
      ) : reservations.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <Calendar className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-400 mb-1">No Reservations Found</h3>
          <p className="text-sm text-gray-600">Incoming bookings will appear here instantly when customers book online.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {reservations.map((res) => (
            <motion.div
              key={res.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6"
            >
              <div className="space-y-2 flex-1">
                <div className="flex items-center space-x-3">
                  <h3 className="text-lg font-bold text-white">{res.guestName}</h3>
                  <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                    res.status === "CONFIRMED" ? "bg-green-400/10 text-green-400 border-green-400/20" :
                    res.status === "CANCELLED" ? "bg-red-400/10 text-red-400 border-red-400/20" :
                    "bg-yellow-400/10 text-yellow-400 border-yellow-400/20"
                  }`}>
                    {res.status}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                  <span className="flex items-center"><Calendar className="w-4 h-4 mr-1.5 text-gray-500" /> {new Date(res.date).toLocaleDateString()}</span>
                  <span className="flex items-center"><Clock className="w-4 h-4 mr-1.5 text-gray-500" /> {res.time}</span>
                  <span className="flex items-center"><Users className="w-4 h-4 mr-1.5 text-gray-500" /> {res.guestsCount} Guests</span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs text-gray-500 pt-1">
                  <span className="flex items-center"><Mail className="w-3.5 h-3.5 mr-1" /> {res.guestEmail}</span>
                  {res.guestPhone && <span className="flex items-center"><Phone className="w-3.5 h-3.5 mr-1" /> {res.guestPhone}</span>}
                </div>

                {res.specialReq && (
                  <div className="mt-3 p-3 bg-white/5 rounded-xl border border-white/5 text-xs text-gray-300">
                    <span className="font-semibold text-gray-500 uppercase tracking-wider block mb-1">Special Request:</span>
                    {res.specialReq}
                  </div>
                )}
              </div>

              <div className="flex space-x-2 w-full md:w-auto justify-end">
                <button
                  onClick={() => handleStatusUpdate(res.id, "CONFIRMED")}
                  className="px-4 py-2 bg-green-500/10 border border-green-500/20 text-green-400 rounded-xl hover:bg-green-500 hover:text-white transition text-sm font-medium flex items-center"
                >
                  <Check className="w-4 h-4 mr-1.5" /> Confirm
                </button>
                <button
                  onClick={() => handleStatusUpdate(res.id, "CANCELLED")}
                  className="px-4 py-2 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl hover:bg-red-500 hover:text-white transition text-sm font-medium flex items-center"
                >
                  <X className="w-4 h-4 mr-1.5" /> Cancel
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
