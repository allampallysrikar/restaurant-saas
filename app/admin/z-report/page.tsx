"use client";

import React, { useState, useEffect } from "react";
import { getLiveZReportData, updateCashCountAudit, commitAndLockZReport, reopenShiftForNewDay, ZReportLedger } from "@/app/actions/z-report";
import { FileText, Lock, Unlock, DollarSign, CheckCircle, AlertTriangle, Printer, RefreshCw, ShieldAlert, Sparkles, CreditCard, Banknote, Calendar, UserCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function ZReportAndReconciliationPage() {
  const [ledger, setLedger] = useState<ZReportLedger | null>(null);
  const [loading, setLoading] = useState(true);
  const [cashCountInput, setCashCountInput] = useState<number>(3753.00);
  const [isCommitModalOpen, setIsCommitModalOpen] = useState(false);
  const [actionFeedback, setActionFeedback] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    const data = await getLiveZReportData();
    setLedger(data);
    setCashCountInput(data.actualCountedCash);
    setLoading(false);
  };

  const handleCashCountChange = async (val: number) => {
    setCashCountInput(val);
    if (!ledger || ledger.status === "LOCKED_CLOSED") return;
    const res = await updateCashCountAudit(val);
    if (res.success) {
      setLedger(res.ledger);
    }
  };

  const handleCommitLock = async () => {
    if (!ledger) return;
    const res = await commitAndLockZReport();
    if (res.success) {
      setLedger(res.closedLedger);
      setIsCommitModalOpen(false);
      setActionFeedback(`🔒 Register Locked! ${res.closedLedger.reportNumber} officially sealed at ${res.closedLedger.closedAt}. Ready for auditor filing.`);
      setTimeout(() => setActionFeedback(null), 6000);
    }
  };

  const handleReopenNewDay = async () => {
    const res = await reopenShiftForNewDay();
    if (res.success) {
      setLedger(res.newLedger);
      setActionFeedback(`🌅 Shift Reopened for New Business Day! Fresh float of $${res.newLedger.openingDrawerFloat.toFixed(2)} loaded.`);
      setTimeout(() => setActionFeedback(null), 5000);
    }
  };

  if (loading || !ledger) {
    return <div className="min-h-screen bg-[#0A0A0A] p-10 text-center text-gray-400">Loading Z-Report ledger...</div>;
  }

  const isLocked = ledger.status === "LOCKED_CLOSED";

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-[#7C1D35] rounded-2xl text-[#C9A84C] shadow-lg">
            <FileText className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight flex items-center gap-2.5">
              End-of-Day (`Z-Report`) Shift Closing & Ledger
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold ${
                isLocked ? "bg-red-500/20 text-red-400 border border-red-500/40" : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
              }`}>
                {isLocked ? "🔒 LOCKED & SEALED" : "🟢 OPEN SHIFT ACTIVE"}
              </span>
            </h1>
            <p className="text-sm text-gray-400 mt-0.5">
              Cash Drawer Audit • Tender Settlement Reconciliation • Tax Liability & Tip Pool Ledger
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => window.print()}
            className="px-5 py-3 rounded-2xl bg-[#181818] border border-[#2A1A1F] hover:bg-white/10 text-white font-bold text-xs transition flex items-center gap-2"
          >
            <Printer className="w-4 h-4 text-[#C9A84C]" /> Print Z-Report Sheet
          </button>
          {!isLocked ? (
            <button
              onClick={() => setIsCommitModalOpen(true)}
              className="px-6 py-3.5 rounded-2xl bg-[#7C1D35] text-[#C9A84C] font-black text-sm hover:bg-[#9D2442] transition flex items-center gap-2 shadow-2xl"
            >
              <Lock className="w-4 h-4" /> Commit & Lock Daily Register
            </button>
          ) : (
            <button
              onClick={handleReopenNewDay}
              className="px-6 py-3.5 rounded-2xl bg-emerald-500 text-black font-black text-sm hover:bg-emerald-400 transition flex items-center gap-2 shadow-2xl"
            >
              <Unlock className="w-4 h-4" /> Reopen Register for New Business Day
            </button>
          )}
        </div>
      </div>

      {/* Action Banner */}
      <AnimatePresence>
        {actionFeedback && (
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
            className="p-4 bg-emerald-500/20 border border-emerald-400 text-emerald-300 rounded-2xl mb-6 flex items-center justify-between font-bold text-xs shadow-2xl"
          >
            <span className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 flex-shrink-0" /> {actionFeedback}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left 2 Cols: Z-Report Sheet */}
        <div className="lg:col-span-2 bg-[#111111] border-2 border-[#C9A84C]/60 rounded-3xl p-8 shadow-2xl font-mono text-sm space-y-6">
          {/* Sheet Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-[#2A1A1F] pb-4">
            <div>
              <span className="text-xs uppercase text-gray-500 font-bold block">Official Closing Document</span>
              <h2 className="text-2xl font-black text-white">{ledger.reportNumber}</h2>
              <p className="text-xs text-gray-400 mt-0.5">{ledger.branchName} • {ledger.terminalId}</p>
            </div>
            <div className="text-right mt-2 sm:mt-0 text-xs text-gray-400">
              <div>Date: <span className="text-white font-bold">{ledger.closingDate}</span></div>
              <div>Opened: <span className="text-white">{ledger.openedAt}</span> {ledger.closedAt && `• Closed: ${ledger.closedAt}`}</div>
              <div>Manager: <span className="text-[#C9A84C] font-bold">{ledger.managerOnDuty}</span></div>
            </div>
          </div>

          {/* Section 1: Sales Summary */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A84C] mb-3 flex items-center gap-1.5">
              <DollarSign className="w-4 h-4" /> 1. Revenue & Tax Summary
            </h3>
            <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between"><span>Gross Food & Beverage Sales</span><span className="font-bold text-white">${ledger.grossSales.toFixed(2)}</span></div>
              <div className="flex justify-between text-amber-400"><span>Manager Comps & Item Voids</span><span>-${ledger.managerCompsAndVoids.toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-bold text-white text-sm"><span>Net Sales (Taxable Base)</span><span>${ledger.netSales.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-300"><span>Sales Tax Collected (8%)</span><span>${ledger.taxCollected.toFixed(2)}</span></div>
              <div className="flex justify-between pt-2 border-t border-white/10 font-black text-[#C9A84C] text-base"><span>Grand Total Receipts</span><span>${ledger.grandTotalReceipts.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Section 2: Settlement Breakdown */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A84C] mb-3 flex items-center gap-1.5">
              <CreditCard className="w-4 h-4" /> 2. Settlement & Tender Breakdown
            </h3>
            <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between text-emerald-400 font-bold"><span>Cash Tendered at Register</span><span>${ledger.cashTendered.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-300"><span>Visa Credit/Debit Receipts</span><span>${ledger.creditCardTendered.visa.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-300"><span>Mastercard Credit/Debit Receipts</span><span>${ledger.creditCardTendered.mastercard.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-300"><span>American Express Receipts</span><span>${ledger.creditCardTendered.amex.toFixed(2)}</span></div>
              <div className="flex justify-between pt-1 font-bold text-white"><span>Total Card Settlements</span><span>${ledger.totalCardTendered.toFixed(2)}</span></div>
              <div className="flex justify-between text-gray-400"><span>House Account / VIP Direct Billing</span><span>${ledger.houseAccountCharges.toFixed(2)}</span></div>
            </div>
          </div>

          {/* Section 3: Liabilities & Labor */}
          <div>
            <h3 className="text-xs font-black uppercase tracking-wider text-[#C9A84C] mb-3 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4" /> 3. Liabilities & Labor Cost Accrual
            </h3>
            <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-white/5 space-y-2 text-xs">
              <div className="flex justify-between"><span>Tip Pool Accrued Liability (To Staff)</span><span className="font-bold text-emerald-400">${ledger.tipPoolLiability.toFixed(2)}</span></div>
              <div className="flex justify-between"><span>Total Shift Labor Hours</span><span className="font-bold text-white">{ledger.totalLaborHours} hrs</span></div>
              <div className="flex justify-between"><span>Estimated Shift Labor Payroll</span><span className="font-bold text-[#C9A84C]">${ledger.estimatedLaborCost.toFixed(2)}</span></div>
            </div>
          </div>

          <div className="text-center pt-4 border-t border-[#2A1A1F] text-[11px] text-gray-500">
            *** END OF DAILY Z-REPORT • SYSTEM GENERATED AUDIT LEDGER ***
          </div>
        </div>

        {/* Right Col: Cash Drawer Audit Card */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl font-mono">
            <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
              <Banknote className="w-5 h-5 text-emerald-400" /> Physical Cash Drawer Audit
            </h2>
            <p className="text-xs text-gray-400 mb-6 font-sans">
              Reconcile physical cash drawer count against register sales before sealing shift.
            </p>

            <div className="space-y-3 text-xs mb-6">
              <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5 flex justify-between">
                <span className="text-gray-400">Opening Register Float:</span>
                <span className="font-bold text-white">${ledger.openingDrawerFloat.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-[#0A0A0A] rounded-xl border border-white/5 flex justify-between">
                <span className="text-gray-400">+ Cash Sales Tendered:</span>
                <span className="font-bold text-emerald-400">${ledger.cashTendered.toFixed(2)}</span>
              </div>
              <div className="p-3.5 bg-[#181818] rounded-xl border border-[#C9A84C]/40 flex justify-between font-bold text-sm">
                <span className="text-[#C9A84C]">Expected Closing Cash:</span>
                <span className="text-white">${ledger.expectedClosingCash.toFixed(2)}</span>
              </div>
            </div>

            <div className="mb-6">
              <label className="text-xs uppercase font-bold text-gray-400 block mb-2">
                Physical Counted Cash ($):
              </label>
              <input
                type="number"
                value={cashCountInput}
                disabled={isLocked}
                onChange={(e) => handleCashCountChange(Number(e.target.value))}
                className="w-full bg-[#0A0A0A] border-2 border-[#C9A84C] rounded-2xl p-4 font-black text-2xl text-white text-center focus:outline-none disabled:opacity-50"
              />
            </div>

            {/* Over/Short Banner */}
            <div className={`p-4 rounded-2xl border text-center ${
              ledger.overShortAmount === 0
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : ledger.overShortAmount > 0
                  ? "bg-amber-500/20 border-amber-400 text-amber-300"
                  : "bg-red-500/20 border-red-400 text-red-300"
            }`}>
              <span className="text-[10px] uppercase font-bold block opacity-80">Cash Drawer Variance Audit:</span>
              <span className="text-xl font-black block mt-0.5">
                {ledger.overShortAmount === 0 && "✅ EXACT MATCH ($0.00)"}
                {ledger.overShortAmount > 0 && `+$${ledger.overShortAmount.toFixed(2)} OVER FLOAT`}
                {ledger.overShortAmount < 0 && `-$${Math.abs(ledger.overShortAmount).toFixed(2)} SHORTAGE`}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Commit Modal */}
      <AnimatePresence>
        {isCommitModalOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.9, y: 20 }}
              className="bg-[#111111] border-2 border-[#7C1D35] rounded-3xl p-8 max-w-md w-full text-center flex flex-col items-center shadow-2xl font-mono"
            >
              <div className="p-3 bg-[#7C1D35]/20 text-[#7C1D35] rounded-2xl mb-4 border border-[#7C1D35]/40">
                <Lock className="w-10 h-10" />
              </div>
              <h3 className="font-bold text-xl text-white">Seal & Lock Daily Register?</h3>
              <p className="text-xs text-gray-400 mt-2 mb-6 font-sans leading-relaxed">
                Committing this Z-Report will lock all transactions for <span className="font-bold text-[#C9A84C]">{ledger.closingDate}</span>. No further checks, voids, or cash sales can be modified without corporate auditor override.
              </p>

              <div className="bg-[#0A0A0A] p-4 rounded-2xl border border-[#2A1A1F] w-full mb-6 text-left text-xs space-y-1">
                <div className="flex justify-between"><span>Grand Receipts:</span><span className="font-bold text-[#C9A84C]">${ledger.grandTotalReceipts.toFixed(2)}</span></div>
                <div className="flex justify-between"><span>Drawer Variance:</span><span className="font-bold text-white">{ledger.overShortAmount >= 0 ? `+$${ledger.overShortAmount}` : `-$${Math.abs(ledger.overShortAmount)}`}</span></div>
              </div>

              <div className="flex gap-3 w-full font-sans">
                <button
                  onClick={() => setIsCommitModalOpen(false)}
                  className="flex-1 py-3.5 rounded-xl bg-[#2A1A1F] text-white font-bold text-xs hover:bg-white/10 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCommitLock}
                  className="flex-1 py-3.5 rounded-xl bg-[#7C1D35] text-[#C9A84C] font-black text-xs hover:bg-[#9D2442] transition shadow-lg flex items-center justify-center gap-1.5"
                >
                  <CheckCircle className="w-4 h-4" /> Yes, Seal Ledger
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
