import React from "react";
import { TrendingUp, DollarSign, ShoppingCart, Users, ArrowUpRight, Flame } from "lucide-react";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  return neon(url);
}

export default async function AdminDashboard() {
  const sql = getDb();
  
  // Fetch stats in parallel
  const [revenueData, ordersData, pendingData, reservationsData, recentOrders, topDishes] = await Promise.all([
    sql`SELECT SUM("totalAmount") as revenue FROM "Order"`,
    sql`SELECT COUNT(*) as count FROM "Order"`,
    sql`SELECT COUNT(*) as count FROM "Order" WHERE status = 'PENDING'`,
    sql`SELECT COUNT(*) as count FROM "Reservation"`,
    sql`SELECT id, "userId", "totalAmount", status, "createdAt",
        (SELECT COUNT(*) FROM "OrderItem" WHERE "orderId" = "Order".id) as items
        FROM "Order" ORDER BY "createdAt" DESC LIMIT 5`,
    sql`
      SELECT m.name, SUM(oi.quantity) as total 
      FROM "OrderItem" oi 
      JOIN "MenuItem" m ON m.id = oi."menuItemId" 
      GROUP BY m.name 
      ORDER BY total DESC 
      LIMIT 3
    `
  ]);

  const totalRevenue = revenueData[0]?.revenue || 0;
  const totalOrders = ordersData[0]?.count || 0;
  const pendingOrders = pendingData[0]?.count || 0;
  const totalReservations = reservationsData[0]?.count || 0;

  const stats = [
    { title: "Total Revenue", value: `$${Number(totalRevenue).toFixed(2)}`, icon: <DollarSign className="w-6 h-6 text-green-400" /> },
    { title: "Total Orders", value: totalOrders, icon: <ShoppingCart className="w-6 h-6 text-blue-400" /> },
    { title: "Pending Orders", value: pendingOrders, icon: <TrendingUp className="w-6 h-6 text-orange-400" /> },
    { title: "Total Reservations", value: totalReservations, icon: <Users className="w-6 h-6 text-purple-400" /> },
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-end mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Dashboard Overview</h1>
          <p className="text-gray-400">Welcome back, Admin. Here is what's happening today.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {stats.map((stat, i) => (
          <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${i * 100}ms`, animationFillMode: 'both' }}>
            <div className="flex justify-between items-start mb-4">
              <div className="p-3 bg-white/5 rounded-xl">{stat.icon}</div>
            </div>
            <h3 className="text-gray-400 text-sm font-medium mb-1">{stat.title}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Orders Table */}
        <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden lg:col-span-2">
          <div className="px-6 py-5 border-b border-white/10 flex justify-between items-center">
            <h2 className="text-lg font-bold">Recent Orders</h2>
            <a href="/admin/orders" className="text-sm text-blue-400 hover:text-blue-300">View All</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-white/5 text-gray-400 text-sm">
                <tr>
                  <th className="px-6 py-4 font-medium">Order ID</th>
                  <th className="px-6 py-4 font-medium">Customer</th>
                  <th className="px-6 py-4 font-medium">Status</th>
                  <th className="px-6 py-4 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentOrders.map((order, i) => (
                  <tr key={i} className="hover:bg-white/5 transition-colors">
                    <td className="px-6 py-4">
                      <span className="font-medium">{String(order.id).slice(-8).toUpperCase()}</span>
                      <div className="text-xs text-gray-500 mt-1">{new Date(order.createdAt).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-6 py-4 text-gray-300">{order.userId || "Guest"} <span className="text-gray-500 text-xs ml-2">({order.items} items)</span></td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        order.status === 'PENDING' ? 'bg-orange-400/10 text-orange-400 border-orange-400/20' : 
                        order.status === 'READY' ? 'bg-blue-400/10 text-blue-400 border-blue-400/20' : 
                        order.status === 'PREPARING' ? 'bg-yellow-400/10 text-yellow-400 border-yellow-400/20' :
                        'bg-green-400/10 text-green-400 border-green-400/20'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-medium">${Number(order.totalAmount).toFixed(2)}</td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-gray-500">No orders found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Most Popular Dishes */}
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
          <div className="flex items-center mb-6">
            <Flame className="w-5 h-5 text-orange-500 mr-2" />
            <h2 className="text-lg font-bold">Most Popular Dishes</h2>
          </div>
          
          <div className="space-y-4">
            {topDishes.map((dish, i) => (
              <div key={i} className="flex justify-between items-center p-4 bg-white/5 border border-white/5 rounded-xl">
                <div className="flex items-center">
                  <div className="w-8 h-8 rounded-full bg-orange-500/20 text-orange-400 flex items-center justify-center font-bold mr-4">
                    {i + 1}
                  </div>
                  <span className="font-medium">{dish.name}</span>
                </div>
                <div className="text-sm font-bold text-gray-400">
                  {dish.total} ordered
                </div>
              </div>
            ))}
            {topDishes.length === 0 && (
              <div className="text-center text-gray-500 py-4">Not enough data.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
