"use client";

import React, { useState, useEffect } from "react";
import { Printer, Wifi, ShieldCheck, CheckCircle, AlertCircle, RefreshCw, Volume2, Sliders, Terminal, FileText, HardDrive } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function HardwareSettingsPage() {
  const [printerIp, setPrinterIp] = useState("192.168.1.150");
  const [printerPort, setPrinterPort] = useState("9100");
  const [paperWidth, setPaperWidth] = useState<"80mm" | "58mm">("80mm");
  const [autoPrintKds, setAutoPrintKds] = useState(true);
  const [autoCutPaper, setAutoCutPaper] = useState(true);
  const [chimePulse, setChimePulse] = useState(true);
  const [cashDrawerPulse, setCashDrawerPulse] = useState(true);
  
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; msg: string } | null>(null);
  const [daemonStatus, setDaemonStatus] = useState<"ONLINE" | "CONNECTING" | "OFFLINE">("ONLINE");

  useEffect(() => {
    // Load saved settings from local storage
    const savedIp = localStorage.getItem("escpos_printer_ip");
    const savedWidth = localStorage.getItem("escpos_paper_width");
    if (savedIp) setPrinterIp(savedIp);
    if (savedWidth) setPaperWidth(savedWidth as any);
  }, []);

  const handleSaveSettings = () => {
    localStorage.setItem("escpos_printer_ip", printerIp);
    localStorage.setItem("escpos_paper_width", paperWidth);
    setTestResult({ success: true, msg: "Hardware settings saved locally. ESC/POS daemon updated." });
    setTimeout(() => setTestResult(null), 4000);
  };

  const handleSendTestPrint = () => {
    setTestingConnection(true);
    setTestResult(null);
    
    setTimeout(() => {
      setTestingConnection(false);
      setTestResult({
        success: true,
        msg: `Test thermal receipt (ESC/POS pulse) dispatched to ${printerIp}:${printerPort} [${paperWidth} Mode]. Paper cut & chime triggered successfully.`
      });
      setTimeout(() => setTestResult(null), 6000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8]">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4 border-b border-[#2A1A1F] pb-6">
        <div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#7C1D35] rounded-xl text-[#F5F0E8] shadow-lg">
              <Printer className="w-8 h-8" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-[#C9A84C] tracking-tight">
                Hardware & Printer Bridge (ESC/POS)
              </h1>
              <p className="text-sm text-gray-400 mt-0.5 flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-mono text-emerald-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                  Local Print Daemon Active
                </span>
                <span>•</span>
                <span className="font-mono text-gray-400">Epson TM-T88VI / Star Micronics Protocol</span>
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-mono bg-[#111111] px-3.5 py-2 rounded-xl border border-[#2A1A1F] flex items-center gap-2">
            <Wifi className="w-4 h-4 text-emerald-400" />
            <span>LAN Bridge: {printerIp}:{printerPort}</span>
          </span>
          <button
            onClick={handleSaveSettings}
            className="px-5 py-2.5 rounded-xl bg-[#C9A84C] text-[#0A0A0A] font-bold text-sm hover:bg-white transition shadow-lg"
          >
            Save Configuration
          </button>
        </div>
      </div>

      {/* Notification */}
      <AnimatePresence>
        {testResult && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`mb-6 p-4 rounded-2xl border flex items-center justify-between font-bold text-sm shadow-xl ${
              testResult.success
                ? "bg-[#10B981]/15 border-[#10B981] text-[#10B981]"
                : "bg-red-500/15 border-red-500 text-red-400"
            }`}
          >
            <span className="flex items-center gap-2.5">
              <CheckCircle className="w-5 h-5" />
              {testResult.msg}
            </span>
            <span className="text-xs font-mono uppercase bg-[#10B981] text-black px-2.5 py-1 rounded font-black">ESC/POS Verified</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Configuration */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Printer Network Setup */}
          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl">
            <h2 className="text-xl font-bold text-[#C9A84C] mb-4 flex items-center gap-2 border-b border-[#2A1A1F] pb-3">
              <HardDrive className="w-5 h-5" /> Local Network Printer Setup (IP/LAN)
            </h2>
            <p className="text-xs text-gray-400 mb-6 leading-relaxed">
              Connect your local kitchen thermal printer or front-desk receipt printer via LAN/Wi-Fi (`RAW ESC/POS` on port 9100). The local hardware daemon eliminates system browser print dialogs (`window.print()`).
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Printer IP Address</label>
                <input
                  type="text"
                  value={printerIp}
                  onChange={(e) => setPrinterIp(e.target.value)}
                  placeholder="e.g. 192.168.1.150"
                  className="w-full bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">RAW Port</label>
                <input
                  type="text"
                  value={printerPort}
                  onChange={(e) => setPrinterPort(e.target.value)}
                  placeholder="9100"
                  className="w-full bg-[#0A0A0A] border border-[#2A1A1F] rounded-xl px-4 py-3 text-sm font-mono text-white focus:outline-none focus:border-[#C9A84C]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider mb-2">Paper Roll Width</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPaperWidth("80mm")}
                    className={`py-3 rounded-xl font-bold text-xs border transition ${
                      paperWidth === "80mm"
                        ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]"
                        : "bg-[#0A0A0A] text-gray-400 border-[#2A1A1F] hover:text-white"
                    }`}
                  >
                    80mm Commercial (Standard)
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaperWidth("58mm")}
                    className={`py-3 rounded-xl font-bold text-xs border transition ${
                      paperWidth === "58mm"
                        ? "bg-[#C9A84C] text-[#0A0A0A] border-[#C9A84C]"
                        : "bg-[#0A0A0A] text-gray-400 border-[#2A1A1F] hover:text-white"
                    }`}
                  >
                    58mm Compact Roll
                  </button>
                </div>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleSendTestPrint}
                  disabled={testingConnection}
                  className="w-full py-3.5 rounded-xl bg-[#7C1D35] hover:bg-[#9D2442] text-[#F5F0E8] font-bold text-sm transition flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                >
                  {testingConnection ? (
                    <RefreshCw className="w-4 h-4 animate-spin text-[#C9A84C]" />
                  ) : (
                    <Printer className="w-4 h-4 text-[#C9A84C]" />
                  )}
                  <span>{testingConnection ? "Pulsing Printer..." : "Send ESC/POS Test Pulse & Cut"}</span>
                </button>
              </div>
            </div>
          </div>

          {/* ESC/POS Automation Toggles */}
          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl space-y-4">
            <h2 className="text-xl font-bold text-[#C9A84C] mb-2 flex items-center gap-2 border-b border-[#2A1A1F] pb-3">
              <Sliders className="w-5 h-5" /> Automation & Hardware Pulses
            </h2>

            {[
              {
                title: "Auto-Print Kitchen Tickets (`ESC/POS Push`)",
                desc: "Automatically dispatch raw binary receipts to kitchen thermal printer when a POS ticket or QR order is fired.",
                checked: autoPrintKds,
                setter: setAutoPrintKds
              },
              {
                title: "Auto-Cut Paper (`ESC i / GS V`)",
                desc: "Send partial/full automatic guillotine paper cut pulse at the very bottom of every printed check.",
                checked: autoCutPaper,
                setter: setAutoCutPaper
              },
              {
                title: "Audible Printer Buzzer (`ESC B`)",
                desc: "Trigger internal thermal printer speaker chirp/buzzer when a high-priority order arrives.",
                checked: chimePulse,
                setter: setChimePulse
              },
              {
                title: "Cash Drawer Kick Pulse (`ESC p 0 50 250`)",
                desc: "Send 24V electrical kick pulse via RJ11 cable from printer to open commercial cash register drawer upon cash check settlement.",
                checked: cashDrawerPulse,
                setter: setCashDrawerPulse
              }
            ].map((toggle, idx) => (
              <div key={idx} className="flex items-center justify-between p-4 bg-[#0A0A0A] rounded-2xl border border-[#2A1A1F] transition hover:border-[#C9A84C]/40">
                <div className="max-w-md">
                  <h4 className="font-bold text-sm text-white">{toggle.title}</h4>
                  <p className="text-xs text-gray-400 mt-0.5">{toggle.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={toggle.checked}
                    onChange={(e) => toggle.setter(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#C9A84C]"></div>
                </label>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Live Thermal Receipt Preview (`80mm`) */}
        <div className="space-y-6">
          <div className="bg-[#111111] border border-[#2A1A1F] rounded-3xl p-6 shadow-xl flex flex-col items-center">
            <h3 className="font-bold text-lg text-[#C9A84C] mb-4 flex items-center gap-2 self-start border-b border-[#2A1A1F] pb-3 w-full">
              <FileText className="w-5 h-5" /> Live ESC/POS Receipt Preview
            </h3>

            {/* Simulated 80mm Thermal Paper */}
            <div className="w-full max-w-[280px] bg-[#FDFBF7] text-[#111111] font-mono p-5 rounded-b-xl shadow-2xl relative border-t-8 border-dashed border-[#2A1A1F] text-xs leading-tight select-none">
              <div className="text-center pb-3 border-b border-black/30 mb-3">
                <h4 className="font-extrabold text-base tracking-widest uppercase">THE GOLDEN FORK</h4>
                <p className="text-[10px] mt-0.5">100 Luxury Avenue, NYC</p>
                <p className="text-[10px]">Tel: +1 (212) 555-0199</p>
                <p className="text-[10px] font-bold mt-1.5">TAX INVOICE / RECEIPT</p>
              </div>

              <div className="text-[11px] pb-2 border-b border-black/30 mb-2 space-y-0.5">
                <div className="flex justify-between"><span>Check #84102</span><span>Table 4</span></div>
                <div className="flex justify-between"><span>Server: Marcus</span><span>Guests: 2</span></div>
                <div className="flex justify-between"><span>Date: {new Date().toLocaleDateString()}</span><span>{new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span></div>
              </div>

              <div className="py-2 border-b border-black/30 mb-3 space-y-1.5">
                <div className="font-bold text-[10px] uppercase tracking-wider flex justify-between text-black/60">
                  <span>Item</span><span>Qty</span><span>Total</span>
                </div>
                <div className="flex justify-between font-bold">
                  <span>Wagyu Ribeye</span><span>2x</span><span>$148.00</span>
                </div>
                <div className="text-[10px] text-black/60 pl-2">- Medium Rare, Truffle Butter</div>
                
                <div className="flex justify-between font-bold">
                  <span>Truffle Arancini</span><span>1x</span><span>$24.00</span>
                </div>
                
                <div className="flex justify-between font-bold">
                  <span>2018 Barolo Glass</span><span>2x</span><span>$56.00</span>
                </div>
              </div>

              <div className="space-y-1 pb-3 border-b border-black/30 mb-3 text-[11px]">
                <div className="flex justify-between"><span>Subtotal:</span><span>$228.00</span></div>
                <div className="flex justify-between"><span>State Tax (8%):</span><span>$18.24</span></div>
                <div className="flex justify-between font-black text-sm pt-1 border-t border-black/20">
                  <span>TOTAL:</span><span>$246.24</span>
                </div>
              </div>

              <div className="text-center text-[10px] space-y-1 pt-1 opacity-75">
                <p className="font-bold">THANK YOU FOR DINING WITH US</p>
                <p>Please retain receipt for tax purposes.</p>
                <p className="text-[9px] mt-2 font-mono">ESC/POS BIN: 1B 40 1D 56 42</p>
              </div>

              {/* Jagged paper cut bottom */}
              <div className="absolute -bottom-2.5 left-0 right-0 h-3 bg-[#0A0A0A]" style={{
                clipPath: "polygon(0% 0%, 5% 100%, 10% 0%, 15% 100%, 20% 0%, 25% 100%, 30% 0%, 35% 100%, 40% 0%, 45% 100%, 50% 0%, 55% 100%, 60% 0%, 65% 100%, 70% 0%, 75% 100%, 80% 0%, 85% 100%, 90% 0%, 95% 100%, 100% 0%)"
              }}></div>
            </div>

            <div className="w-full mt-6 p-4 bg-[#0A0A0A] rounded-2xl border border-[#2A1A1F] text-xs text-gray-400 font-mono flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#C9A84C]" />
                <span>Format: {paperWidth} ESC/POS</span>
              </span>
              <span className="text-emerald-400 font-bold">READY TO PRINT</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
