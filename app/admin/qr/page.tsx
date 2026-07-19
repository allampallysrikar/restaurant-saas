"use client";

import React from "react";
import { Printer } from "lucide-react";

const tables = [
  ...Array.from({ length: 15 }, (_, i) => ({
    id: `table-${i + 1}`,
    name: `Table ${i + 1}`,
    url: `https://restaurant-saas-six-teal.vercel.app/table/${i + 1}`
  })),
  {
    id: "vip-room",
    name: "VIP Private Room",
    url: "https://restaurant-saas-six-teal.vercel.app/table/vip"
  }
];

export default function QRStandsPage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-6 text-[#F5F0E8] print:p-0 print:bg-white">
      <div className="flex justify-between items-center mb-8 print:hidden">
        <h1 className="text-3xl font-bold text-[#C9A84C]">Printable QR Code Table Stands</h1>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 bg-[#7C1D35] hover:bg-[#9D2442] text-[#C9A84C] px-6 py-3 rounded-lg font-bold transition"
        >
          <Printer className="w-5 h-5" />
          Print Stands
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 print:grid-cols-2 print:gap-4 print:w-full">
        {tables.map((table) => {
          // color=C9A84C is hex without # -> C9A84C
          // bgcolor=111111 is hex without # -> 111111
          const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(table.url)}&color=C9A84C&bgcolor=111111`;
          
          return (
            <div 
              key={table.id}
              className="bg-[#111111] border-4 border-[#2A1A1F] rounded-2xl flex flex-col items-center justify-center p-8 text-center aspect-[3/4] shadow-2xl print:border-[#000000] print:shadow-none print:break-inside-avoid print:bg-[#111111] print:[color-adjust:exact] print:[-webkit-print-color-adjust:exact]"
            >
              <h2 className="font-serif text-3xl font-bold text-[#C9A84C] mb-8 tracking-widest uppercase">
                The Golden Fork
              </h2>
              
              <div className="bg-[#111111] p-4 rounded-xl border-2 border-[#C9A84C]/30 mb-8">
                <img 
                  src={qrUrl} 
                  alt={`QR Code for ${table.name}`}
                  className="w-48 h-48"
                  crossOrigin="anonymous"
                />
              </div>

              <h3 className="text-xl font-bold text-[#F5F0E8] mb-2">{table.name}</h3>
              <p className="text-[#F5F0E8]/70 text-sm max-w-[200px] leading-relaxed">
                Scan with your phone's camera to view the menu and order directly to your table.
              </p>
            </div>
          );
        })}
      </div>

      <style jsx global>{`
        @media print {
          body {
            background-color: white !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          @page {
            size: A4;
            margin: 1cm;
          }
        }
      `}</style>
    </div>
  );
}
