"use client";

import React, { useState, useEffect } from "react";
import { getStaffList, punchTimeclock, calculateTipPoolDistribution, StaffMember } from "@/app/actions/staff";
import { Users, Clock, DollarSign, CheckCircle, AlertCircle, Lock, ShieldAlert, Sparkles, Printer, RefreshCw, Briefcase, Award } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function StaffAndTipPoolPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ROSTER" | "TIMECLOCK" | "TIPS">("ROSTER");

  // Timeclock PIN state
  const [pinInput, setPinInput] = useState("");
  const [punchResult, setPunchResult] = useState<{ success: boolean; action?: string; member?: StaffMember; error?: string } | null>(null);

  // Tip Pool state
  const [dailyTipsInput, setDailyTipsInput] = useState(520.00);
  const [fohSplitPercent, setFohSplitPercent] = useState(70);
  const [tipDistribution, setTipDistribution] = useState<{
    totalTips: number;
    fohPool: number;
    bohPool: number;
    payouts: any[];
  } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const list = await getStaffList();
    setStaff(list);
    const dist = await calculateTipPoolDistribution(dailyTipsInput, fohSplitPercent);
    setTipDistribution(dist);
    setLoading(false);
  };

  const handlePinPunch = async () => {
    if (pinInput.length !== 4) return;
    const res = await punchTimeclock(pinInput);
    setPunchResult(res);
    setPinInput("");
    if (res.success) {
      loadData();
      setTimeout(() => setPunchResult(null), 5000);
    }
  };

  const handleRecalculateTips = async (tips: number, fohSplit: number) => {
    setDailyTipsInput(tips);
    setFohSplitPercent(fohSplit);
    const dist = await calculateTipPoolDistribution(tips, fohSplit);
    setTipDistribution(dist);
  };

  const activeStaffCount = staff.filter(s => s.status === "CLOCKED_IN").length;
  const totalHoursWorkedToday = staff.reduce((acc, s) => acc + s.hoursWorkedToday, 0);

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7C1D35] rounded-2xl text-[#C9A84C] shadow-lg">
            <Users className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight">
              Staff HR, Timeclock & Tip Pool Calculator
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              4-Digit PIN Shift Punch-In/Out • Weighted Tip Distribution Matrix • Printable Shift Slips
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono bg-[#111111] px-4 py-3 rounded-2xl border border-[#2A1A1F]">
          <div>
            <span className="text-gray-400">Active Roster:</span>
            <div className="text-base font-bold text-emerald-400">{activeStaffCount} / {staff.length} Clocked In</div>
          </div>
          <div className="h-8 w-px bg-[#2A1A1F]" />
          <div>
            <span className="text-gray-400">Total Labor Hours Today:</span>
            <div className="text-base font-bold text-[#C9A84C]">{totalHoursWorkedToday.toFixed(1)} hrs</div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-8">
        <button
          onClick={() => setActiveTab("ROSTER")}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition ${
            activeTab === "ROSTER" ? "bg-[#C9A84C] text-[#0A0A0A] shadow-xl" : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-white"
          }`}
        >
          <Briefcase className="w-4 h-4" /> Active Staff Roster ({staff.length})
        </button>
        <button
          onClick={() => {
            setActiveTab("TIMECLOCK");
            setPunchResult(null);
          }}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition ${
            activeTab === "TIMECLOCK" ? "bg-[#C9A84C] text-[#0A0A0A] shadow-xl" : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-white"
          }`}
        >
          <Clock className="w-4 h-4" /> PIN Timeclock Terminal
        </button>
        <button
          onClick={() => setActiveTab("TIPS")}
          className={`px-5 py-3 rounded-2xl font-bold text-sm flex items-center gap-2 transition ${
            activeTab === "TIPS" ? "bg-[#7C1D35] text-[#C9A84C] border border-[#C9A84C] shadow-xl" : "bg-[#111111] border border-[#2A1A1F] text-gray-400 hover:text-white"
          }`}
        >
          <DollarSign className="w-4 h-4 text-[#C9A84C]" /> Tip Pooling Distribution Matrix
        </button>
      </div>

      {/* TAB 1: ROSTER */}
      {activeTab === "ROSTER" && (
        <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-2xl overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#2A1A1F] text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                <th className="py-3.5 px-4">Staff Member</th>
                <th className="py-3.5 px-4">Role & Department</th>
                <th className="py-3.5 px-4">Shift Status</th>
                <th className="py-3.5 px-4">Base Wage ($/hr)</th>
                <th className="py-3.5 px-4">Tip Pool Points</th>
                <th className="py-3.5 px-4">Hours Today</th>
                <th className="py-3.5 px-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#2A1A1F] text-sm">
              {staff.map((s) => (
                <tr key={s.id} className="hover:bg-white/[0.02] transition">
                  <td className="py-4 px-4 font-bold text-white">
                    <div>{s.name}</div>
                    <span className="text-[10px] font-mono text-gray-500">PIN: **** (Try `{s.pin}`)</span>
                  </td>
                  <td className="py-4 px-4 text-xs font-mono">
                    <span className="px-2 py-0.5 rounded bg-black/40 text-[#C9A84C] border border-white/5 font-bold">{s.role}</span>
                    <span className="ml-2 text-gray-400">[{s.department}]</span>
                  </td>
                  <td className="py-4 px-4">
                    {s.status === "CLOCKED_IN" && <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1.5 w-max"><CheckCircle className="w-3.5 h-3.5" /> Clocked In</span>}
                    {s.status === "CLOCKED_OUT" && <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-500/20 text-gray-400 border border-gray-500/40 w-max block">Clocked Out</span>}
                    {s.status === "ON_BREAK" && <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 w-max block">On Break</span>}
                  </td>
                  <td className="py-4 px-4 font-mono text-gray-300">${s.hourlyRate.toFixed(2)}/hr</td>
                  <td className="py-4 px-4 font-mono font-bold text-amber-400">{s.tipPoolPoints} pts</td>
                  <td className="py-4 px-4 font-mono font-black text-white">{s.hoursWorkedToday.toFixed(1)} hrs</td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => {
                        setActiveTab("TIMECLOCK");
                        setPinInput(s.pin);
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#2A1A1F] hover:bg-[#C9A84C] hover:text-[#0A0A0A] text-[#F5F0E8] font-bold text-xs transition"
                    >
                      Punch Shift
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 2: TIMECLOCK TERMINAL */}
      {activeTab === "TIMECLOCK" && (
        <div className="max-w-md mx-auto bg-[#111111] border-2 border-[#C9A84C] rounded-3xl p-8 shadow-2xl text-center flex flex-col items-center">
          <div className="p-3 bg-[#C9A84C]/20 text-[#C9A84C] rounded-2xl mb-4 border border-[#C9A84C]/40">
            <Clock className="w-10 h-10" />
          </div>
          <h2 className="text-2xl font-bold text-white">Staff Timeclock & Shift Punch</h2>
          <p className="text-xs text-gray-400 mt-1 mb-6">Enter your 4-digit PIN to clock in, clock out, or return from break.</p>

          {/* PIN Dots */}
          <div className="flex justify-center gap-3 mb-6 font-mono text-3xl font-black text-[#C9A84C] bg-[#0A0A0A] px-6 py-4 rounded-2xl border border-[#2A1A1F] w-full tracking-widest">
            {pinInput ? "*".repeat(pinInput.length).padEnd(4, "•") : "••••"}
          </div>

          {/* Punch Feedback Alert */}
          <AnimatePresence>
            {punchResult && (
              <motion.div
                initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                className={`p-4 rounded-2xl border w-full mb-6 text-left text-xs font-bold ${
                  punchResult.success ? "bg-emerald-500/20 border-emerald-400 text-emerald-300" : "bg-red-500/20 border-red-400 text-red-300"
                }`}
              >
                {punchResult.success ? (
                  <div className="flex items-center gap-3">
                    <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
                    <div>
                      <p className="text-white text-sm">{punchResult.member?.name} ({punchResult.member?.role})</p>
                      <p className="text-emerald-400 font-mono mt-0.5">Shift Status Updated: {punchResult.action}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                    <span>{punchResult.error}</span>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Numpad */}
          <div className="grid grid-cols-3 gap-2.5 w-full mb-4 font-mono">
            {["1", "2", "3", "4", "5", "6", "7", "8", "9", "Clear", "0", "Punch"].map((btn) => (
              <button
                key={btn}
                onClick={() => {
                  if (btn === "Clear") {
                    setPinInput("");
                    setPunchResult(null);
                  } else if (btn === "Punch") {
                    handlePinPunch();
                  } else if (pinInput.length < 4) {
                    const newPin = pinInput + btn;
                    setPinInput(newPin);
                    if (newPin.length === 4) {
                      setTimeout(() => {
                        punchTimeclock(newPin).then(res => {
                          setPunchResult(res);
                          setPinInput("");
                          if (res.success) loadData();
                        });
                      }, 150);
                    }
                  }
                }}
                className={`py-4 rounded-2xl font-bold text-lg transition ${
                  btn === "Punch"
                    ? "bg-[#C9A84C] text-[#0A0A0A] font-black"
                    : btn === "Clear"
                      ? "bg-red-950/40 text-red-300 hover:bg-red-900/60 text-xs"
                      : "bg-[#181818] border border-[#2A1A1F] text-[#F5F0E8] hover:bg-[#2A1A1F]"
                }`}
              >
                {btn}
              </button>
            ))}
          </div>

          <div className="mt-2 text-[11px] text-gray-500 font-mono">
            Demo PINs: Marcus (`1111`), Elena (`2222`), Chef (`3333`), Leo (`4444`)
          </div>
        </div>
      )}

      {/* TAB 3: TIP POOLING CALCULATOR */}
      {activeTab === "TIPS" && tipDistribution && (
        <div className="bg-[#111111] border border-[#C9A84C]/60 rounded-3xl p-8 shadow-2xl max-w-5xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2A1A1F] pb-6 mb-6 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <Award className="w-6 h-6 text-[#C9A84C]" />
                <span className="font-mono font-bold text-sm uppercase text-gray-400">Shift Payout Closing</span>
              </div>
              <h2 className="text-2xl font-bold text-white mt-1">Weighted Tip Pooling Matrix</h2>
              <p className="text-xs text-gray-400 mt-0.5">Distributes daily tips by (Hours Worked × Tip Points) across FOH & BOH</p>
            </div>

            <div className="flex items-center gap-4 bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A1A1F]">
              <div>
                <label className="text-[10px] uppercase font-mono text-gray-400 block font-bold">Total Daily Tips ($):</label>
                <input
                  type="number"
                  value={dailyTipsInput}
                  onChange={(e) => handleRecalculateTips(Number(e.target.value), fohSplitPercent)}
                  className="w-28 bg-[#111111] border border-[#2A1A1F] rounded-lg px-2 py-1 font-mono font-black text-lg text-emerald-400 focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div className="h-10 w-px bg-[#2A1A1F]" />
              <div>
                <label className="text-[10px] uppercase font-mono text-gray-400 block font-bold">FOH vs BOH Split:</label>
                <select
                  value={fohSplitPercent}
                  onChange={(e) => handleRecalculateTips(dailyTipsInput, Number(e.target.value))}
                  className="bg-[#111111] border border-[#2A1A1F] rounded-lg px-2 py-1.5 font-mono font-bold text-xs text-[#C9A84C] focus:outline-none"
                >
                  <option value={80}>80% FOH / 20% BOH</option>
                  <option value={70}>70% FOH / 30% BOH (Standard)</option>
                  <option value={60}>60% FOH / 40% BOH</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pool Summary Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 text-xs font-mono">
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-emerald-500/30 flex justify-between items-center">
              <div>
                <span className="text-gray-400 block uppercase font-bold">Front of House Pool ({fohSplitPercent}%):</span>
                <span className="text-2xl font-black text-emerald-400">${tipDistribution.fohPool}</span>
              </div>
              <span className="text-xs text-gray-500">Shared across Servers, Sommeliers, Bussers</span>
            </div>
            <div className="p-4 rounded-2xl bg-[#0A0A0A] border border-amber-500/30 flex justify-between items-center">
              <div>
                <span className="text-gray-400 block uppercase font-bold">Kitchen / BOH Pool ({100 - fohSplitPercent}%):</span>
                <span className="text-2xl font-black text-amber-400">${tipDistribution.bohPool}</span>
              </div>
              <span className="text-xs text-gray-500">Shared across Cooks, Prep & Kitchen Staff</span>
            </div>
          </div>

          {/* Payout Table */}
          <table className="w-full text-left border-collapse mb-8">
            <thead>
              <tr className="border-b border-[#2A1A1F] text-xs font-bold uppercase tracking-wider text-gray-400 font-mono">
                <th className="py-3.5 px-3">Staff Member</th>
                <th className="py-3.5 px-3">Department</th>
                <th className="py-3.5 px-3">Hours Worked</th>
                <th className="py-3.5 px-3">Point Weight</th>
                <th className="py-3.5 px-3">Base Wage Earned</th>
                <th className="py-3.5 px-3">Tip Pool Payout ($)</th>
                <th className="py-3.5 px-3">Total Shift Earnings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm font-mono">
              {tipDistribution.payouts.map((p, idx) => {
                const basePay = Number((p.totalEarnings - p.tipPayout).toFixed(2));
                return (
                  <tr key={idx} className="hover:bg-white/[0.02]">
                    <td className="py-3.5 px-3 font-bold text-white">
                      {p.name}
                      <span className="text-[10px] text-gray-500 block">{p.role}</span>
                    </td>
                    <td className="py-3.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-xs font-bold ${p.department === "FOH" ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-300"}`}>
                        {p.department}
                      </span>
                    </td>
                    <td className="py-3.5 px-3 font-bold text-white">{p.hoursWorked} hrs</td>
                    <td className="py-3.5 px-3 text-gray-400">{p.tipPoints} pts</td>
                    <td className="py-3.5 px-3 text-gray-300">${basePay.toFixed(2)}</td>
                    <td className="py-3.5 px-3 font-black text-emerald-400 text-base">+${p.tipPayout.toFixed(2)}</td>
                    <td className="py-3.5 px-3 font-bold text-[#C9A84C] text-base">${p.totalEarnings.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {/* Print Button */}
          <div className="flex justify-end pt-4 border-t border-[#2A1A1F]">
            <button
              onClick={() => window.print()}
              className="px-6 py-3 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-xs hover:bg-white transition flex items-center gap-2 shadow-xl"
            >
              <Printer className="w-4 h-4" /> Print Daily Tip Payout Slips & Shift Report
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
