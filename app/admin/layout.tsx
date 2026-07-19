import React from "react";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, LogOut, Monitor, Tablet, QrCode, Printer, BarChart3, Building2, Boxes, Briefcase, Bot } from "lucide-react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  return neon(url);
}

// Auth temporarily bypassed — admin is accessible directly for demo
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const session = cookieStore.get("admin_session");

  if (session?.value !== "authenticated") {
    redirect("/login");
  }

  const sql = getDb();
  const result = await sql`SELECT COUNT(*) as count FROM "Order" WHERE status = 'PENDING'`;
  const pendingOrders = result[0]?.count || 0;

  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-[#111111] border-r border-[#2A1A1F] flex-col hidden md:flex overflow-y-auto">
        <div className="p-4 border-b border-[#2A1A1F]">
          <span className="font-bold text-xl tracking-tight text-[#C9A84C] block px-2">The Golden Fork</span>
          {/* Branch & Terminal Scoping Badge */}
          <div className="mt-2.5 p-2 bg-[#0A0A0A] rounded-xl border border-[#2A1A1F] flex items-center gap-2 text-xs text-gray-300 shadow-inner">
            <Building2 className="w-4 h-4 text-[#C9A84C] flex-shrink-0" />
            <div className="truncate">
              <div className="font-bold text-white truncate">Downtown Flagship</div>
              <div className="text-[10px] text-emerald-400 font-mono">● Terminal #1 Active</div>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 py-4 px-4 space-y-1.5 text-sm">
          <a href="/admin" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <LayoutDashboard className="w-4 h-4 mr-3" /> Dashboard
          </a>
          <a href="/admin/orders" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition justify-between">
            <div className="flex items-center">
              <ShoppingBag className="w-4 h-4 mr-3" /> Orders
            </div>
            {pendingOrders > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full animate-pulse">
                ● {pendingOrders}
              </span>
            )}
          </a>
          <a href="/admin/reservations" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <Users className="w-4 h-4 mr-3" /> Reservations
          </a>
          <a href="/admin/menu" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <UtensilsCrossed className="w-4 h-4 mr-3" /> Menu Items
          </a>
          <a href="/admin/kds" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <Monitor className="w-4 h-4 mr-3" /> KDS
          </a>
          <a href="/admin/pos" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <Tablet className="w-4 h-4 mr-3" /> POS Terminal
          </a>
          <a href="/admin/qr" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <QrCode className="w-4 h-4 mr-3" /> QR Stands
          </a>
          
          <div className="pt-2 pb-1 px-4 text-[11px] font-bold uppercase tracking-wider text-gray-500 font-mono">
            BI & Enterprise
          </div>
          <a href="/admin/analytics" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <BarChart3 className="w-4 h-4 mr-3 text-[#C9A84C]" /> Menu Engineering BI
          </a>
          <a href="/admin/inventory" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <Boxes className="w-4 h-4 mr-3 text-[#C9A84C]" /> Recipe BOM & Procurement
          </a>
          <a href="/admin/staff" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <Briefcase className="w-4 h-4 mr-3 text-[#C9A84C]" /> Staff HR & Tip Pooling
          </a>
          <a href="/admin/ai-concierge" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <Bot className="w-4 h-4 mr-3 text-[#C9A84C]" /> AI Sommelier Rules
          </a>
          <a href="/admin/hardware" className="flex items-center px-4 py-2.5 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition">
            <Printer className="w-4 h-4 mr-3 text-[#C9A84C]" /> ESC/POS Hardware
          </a>
        </nav>

        <div className="p-4 border-t border-[#2A1A1F]">
          <a href="/" className="flex items-center w-full px-4 py-3 text-[#F5F0E8]/70 hover:bg-[#7C1D35]/20 hover:text-[#C9A84C] rounded-xl transition text-sm">
            ← Back to Website
          </a>
          <a href="/api/admin/logout" className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition text-sm mt-2">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </a>
          <p className="text-xs text-gray-600 px-4 pt-2">admin@xyz.com</p>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-[#111111] border-b border-[#2A1A1F] flex items-center justify-between px-4 md:hidden overflow-x-auto">
          <span className="font-bold text-lg text-[#C9A84C] whitespace-nowrap mr-4">Golden Fork</span>
          <div className="flex gap-3 text-xs text-[#F5F0E8]/80 whitespace-nowrap">
            <a href="/admin/orders" className="hover:text-[#C9A84C]">Orders</a>
            <a href="/admin/pos" className="hover:text-[#C9A84C]">POS</a>
            <a href="/admin/kds" className="hover:text-[#C9A84C]">KDS</a>
            <a href="/admin/analytics" className="hover:text-[#C9A84C]">BI</a>
            <a href="/admin/inventory" className="hover:text-[#C9A84C]">Inventory</a>
            <a href="/admin/staff" className="hover:text-[#C9A84C]">Staff</a>
            <a href="/admin/ai-concierge" className="hover:text-[#C9A84C]">AI</a>
            <a href="/admin/hardware" className="hover:text-[#C9A84C]">Hardware</a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-[#0A0A0A]">
          {children}
        </main>
      </div>
    </div>
  );
}
