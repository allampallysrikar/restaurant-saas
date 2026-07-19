import React from "react";
import { LayoutDashboard, UtensilsCrossed, ShoppingBag, Users, LogOut } from "lucide-react";
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
      <aside className="w-64 bg-zinc-950 border-r border-white/10 flex-col hidden md:flex">
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <span className="font-bold text-xl tracking-tight text-white">XYZ Admin</span>
        </div>
        
        <nav className="flex-1 py-6 px-4 space-y-2">
          <a href="/admin" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </a>
          <a href="/admin/orders" className="flex items-center px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition justify-between">
            <div className="flex items-center">
              <ShoppingBag className="w-5 h-5 mr-3" /> Orders
            </div>
            {pendingOrders > 0 && (
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                ● {pendingOrders}
              </span>
            )}
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
          <a href="/api/admin/logout" className="flex items-center w-full px-4 py-3 text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-xl transition text-sm mt-2">
            <LogOut className="w-4 h-4 mr-2" /> Logout
          </a>
          <p className="text-xs text-gray-600 px-4 pt-2">admin@xyz.com</p>
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
