import React from "react";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users } from "lucide-react";

// Auth temporarily bypassed — admin is accessible directly for demo
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-white/10 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-bold text-xl tracking-tight text-white">XYZ Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <a href="/admin" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </a>
          <a href="/admin/orders" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <ShoppingBag className="w-5 h-5 mr-3" /> Orders
          </a>
          <a href="/admin/reservations" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <Users className="w-5 h-5 mr-3" /> Reservations
          </a>
          <a href="/admin/menu" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <UtensilsCrossed className="w-5 h-5 mr-3" /> Menu Items
          </a>
        </nav>

        <div className="p-4 border-t border-white/10">
          <a href="/" className="flex items-center w-full px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition text-sm">
            ← Back to Website
          </a>
        </div>
      </aside>

      {/* Mobile Top Bar */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-xl text-white">XYZ Admin</span>
          <div className="flex gap-4 text-sm text-gray-400">
            <a href="/admin/orders">Orders</a>
            <a href="/admin/reservations">Reservations</a>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-900/30">
          {children}
        </main>
      </div>
    </div>
  );
}
