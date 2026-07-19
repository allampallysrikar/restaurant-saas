import { neon } from "@neondatabase/serverless";
import { Package, MapPin, CheckCircle, Clock } from "lucide-react";
import Link from "next/link";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

// Ensure dynamic rendering
export const dynamic = "force-dynamic";

export default async function OrderTrackingPage({ params }: { params: { id: string } }) {
  const sql = getDb();

  // Try to fetch order and items
  let orders;
  try {
    orders = await sql`
      SELECT 
        o.id, o.status, o."totalAmount", o."createdAt", 
        oi.quantity, oi."priceAtTime", 
        m.name as item_name 
      FROM "Order" o 
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id 
      LEFT JOIN "MenuItem" m ON m.id = oi."menuItemId" 
      WHERE o.id = ${params.id}
    `;
  } catch (error) {
    console.error("Failed to fetch order:", error);
    orders = [];
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <div className="text-center bg-white/5 border border-white/10 p-10 rounded-3xl max-w-md w-full">
          <h2 className="text-2xl font-bold mb-4">Order Not Found</h2>
          <p className="text-gray-400 mb-8">We couldn't find an order with this ID. It may be invalid or expired.</p>
          <Link href="/menu" className="px-6 py-3 bg-white text-black rounded-xl font-medium inline-block hover:bg-gray-200 transition">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  const orderInfo = orders[0];
  const items = orders.filter(o => o.item_name).map(o => ({
    name: o.item_name,
    quantity: o.quantity,
    price: o.priceAtTime
  }));

  const statuses = ["PENDING", "PREPARING", "OUT_FOR_DELIVERY", "DELIVERED"];
  const currentStatusIndex = statuses.indexOf(orderInfo.status);

  return (
    <div className="container mx-auto px-6 py-24 min-h-screen max-w-4xl">
      <div className="mb-12">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-2">Track Your <span className="bg-gradient-to-r from-gray-200 to-gray-500 bg-clip-text text-transparent">Order</span></h1>
        <p className="text-gray-400">Order ID: <span className="font-mono text-sm">{orderInfo.id}</span></p>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12 mb-8">
        <h2 className="text-xl font-bold mb-8">Order Status</h2>
        
        {/* Progress Bar */}
        <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0">
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-1 bg-white/10 -translate-y-1/2 z-0"></div>
          
          <div className="hidden md:block absolute top-1/2 left-0 h-1 bg-white transition-all duration-500 z-0" style={{ width: `${(Math.max(0, currentStatusIndex) / 3) * 100}%` }}></div>

          {/* Pending */}
          <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStatusIndex >= 0 ? "bg-white text-black border-white" : "bg-black text-gray-500 border-white/20"}`}>
              <Clock className="w-5 h-5" />
            </div>
            <span className={`font-medium ${currentStatusIndex >= 0 ? "text-white" : "text-gray-500"}`}>Pending</span>
          </div>

          {/* Preparing */}
          <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStatusIndex >= 1 ? "bg-white text-black border-white" : "bg-black text-gray-500 border-white/20"}`}>
              <Package className="w-5 h-5" />
            </div>
            <span className={`font-medium ${currentStatusIndex >= 1 ? "text-white" : "text-gray-500"}`}>Preparing</span>
          </div>

          {/* Out for Delivery */}
          <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStatusIndex >= 2 ? "bg-white text-black border-white" : "bg-black text-gray-500 border-white/20"}`}>
              <MapPin className="w-5 h-5" />
            </div>
            <span className={`font-medium ${currentStatusIndex >= 2 ? "text-white" : "text-gray-500"}`}>Out for Delivery</span>
          </div>

          {/* Delivered */}
          <div className="relative z-10 flex flex-row md:flex-col items-center gap-4 md:gap-3">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-colors ${currentStatusIndex >= 3 ? "bg-white text-black border-white" : "bg-black text-gray-500 border-white/20"}`}>
              <CheckCircle className="w-5 h-5" />
            </div>
            <span className={`font-medium ${currentStatusIndex >= 3 ? "text-white" : "text-gray-500"}`}>Delivered</span>
          </div>
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-8 md:p-12">
        <h2 className="text-xl font-bold mb-6">Order Details</h2>
        <div className="space-y-4 mb-8">
          {items.map((item, idx) => (
            <div key={idx} className="flex justify-between items-center py-4 border-b border-white/10 last:border-0">
              <div className="flex items-center gap-4">
                <span className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-sm font-medium">{item.quantity}x</span>
                <span className="font-medium text-gray-200">{item.name}</span>
              </div>
              <span className="text-gray-400">${(Number(item.price) * item.quantity).toFixed(2)}</span>
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center pt-6 border-t border-white/10">
          <span className="text-xl font-bold">Total Paid</span>
          <span className="text-2xl font-bold">${Number(orderInfo.totalAmount).toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
