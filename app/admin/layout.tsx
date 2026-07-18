import React from "react";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Settings, LogOut, Users } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-black text-white overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-950 border-r border-white/10 flex flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-bold text-xl tracking-tight text-white">XYZ Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <a href="/admin" className="flex items-center px-4 py-3 bg-white/10 text-white rounded-xl transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </a>
          <a href="/admin/orders" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <ShoppingBag className="w-5 h-5 mr-3" /> Orders
          </a>
          <a href="/admin/menu" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <UtensilsCrossed className="w-5 h-5 mr-3" /> Menu Items
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <Users className="w-5 h-5 mr-3" /> Customers
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <Settings className="w-5 h-5 mr-3" /> Settings
          </a>
        </nav>
        
        <div className="p-4 border-t border-white/10">
          <button className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition">
            <LogOut className="w-5 h-5 mr-3" /> Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-16 bg-zinc-950 border-b border-white/10 flex items-center justify-between px-6 md:hidden">
          <span className="font-bold text-xl text-white">XYZ Admin</span>
          <button className="text-gray-400"><LayoutDashboard className="w-6 h-6" /></button>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-10 bg-zinc-900/30">
          {children}
        </main>
      </div>
    </div>
  );
}
