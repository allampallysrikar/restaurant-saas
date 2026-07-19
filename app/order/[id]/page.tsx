import { neon } from "@neondatabase/serverless";
import { Package, MapPin, CheckCircle, Clock, Download } from "lucide-react";
import Link from "next/link";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

export const dynamic = "force-dynamic";

interface OrderRow {
  id: string;
  status: string;
  totalAmount: number;
  createdAt: string;
  quantity: number;
  priceAtTime: number;
  item_name: string;
}

export default async function OrderTrackingPage({ params }: { params: { id: string } }) {
  const sql = getDb();

  let orders: OrderRow[] = [];
  try {
    const rows = await sql`
      SELECT 
        o.id, o.status, o."totalAmount", o."createdAt", 
        oi.quantity, oi."priceAtTime", 
        m.name as item_name 
      FROM "Order" o 
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id 
      LEFT JOIN "MenuItem" m ON m.id = oi."menuItemId" 
      WHERE o.id = ${params.id}
    `;
    orders = rows as OrderRow[];
  } catch (error) {
    console.error("Failed to fetch order:", error);
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] text-[#F5F0E8] flex items-center justify-center p-6">
        <div className="text-center bg-[#111111] border border-[#2A1A1F] p-12 rounded-3xl max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#2A1A1F] flex items-center justify-center mb-6">
            <Package className="w-8 h-8 text-[#C9A84C]" />
          </div>
          <h2 className="font-[family-name:var(--font-playfair)] text-3xl font-bold mb-4 text-[#F5F0E8]">Order Not Found</h2>
          <p className="text-gray-400 mb-8">We couldn't locate this order. It may be invalid or expired.</p>
          <Link href="/menu" className="px-8 py-4 bg-[#7C1D35] text-[#F5F0E8] rounded-xl font-bold inline-block hover:bg-[#C9A84C] hover:text-[#0A0A0A] transition-colors shadow-lg w-full">
            Return to Menu
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
    <div className="bg-[#0A0A0A] text-[#F5F0E8] min-h-screen pb-24 pt-32">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-12 text-center md:text-left">
          <h1 className="font-[family-name:var(--font-playfair)] text-4xl md:text-6xl font-bold tracking-tight mb-4 print:hidden">
            Track Your <span className="text-[#C9A84C]">Order</span>
          </h1>
          <h1 className="hidden print:block font-[family-name:var(--font-playfair)] text-4xl font-bold mb-4 text-[#0A0A0A]">
            THE GOLDEN FORK - OFFICIAL TAX INVOICE
          </h1>
          <p className="text-gray-400 print:text-gray-800 uppercase tracking-widest text-sm font-bold">
            Order ID: <span className="text-[#F5F0E8] print:text-black ml-2">{orderInfo.id.split('-')[0]}...</span>
            <span className="ml-4 print:hidden hidden md:inline">| Date: {new Date(orderInfo.createdAt).toLocaleString()}</span>
            <span className="hidden print:inline ml-4">| Date & Time: {new Date(orderInfo.createdAt).toLocaleString()} | Dine-in / Online</span>
          </p>
        </div>

        <div className="flex justify-end mb-4 print:hidden">
          <button 
            onClick={() => { if (typeof window !== 'undefined') window.print(); }}
            className="flex items-center text-sm font-bold text-[#C9A84C] hover:text-[#F5F0E8] transition-colors"
          >
            <Download className="w-4 h-4 mr-2" /> Download / Print Tax Receipt
          </button>
        </div>

        <div className="bg-[#111111] print:bg-white print:border-none border border-[#2A1A1F] rounded-3xl p-8 md:p-12 mb-8 shadow-xl print:shadow-none print:p-0 print:mb-4 print:hidden">
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-12 text-center md:text-left border-b border-[#2A1A1F] pb-4 text-[#F5F0E8]">Status</h2>

          {/* Progress Bar */}
          <div className="relative flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-0 px-4 md:px-0">
            <div className="hidden md:block absolute top-6 left-0 w-full h-1 bg-[#2A1A1F] z-0 rounded-full"></div>
            <div className="hidden md:block absolute top-6 left-0 h-1 bg-[#7C1D35] transition-all duration-1000 z-0 rounded-full shadow-[0_0_10px_#7C1D35]" style={{ width: `${(Math.max(0, currentStatusIndex) / 3) * 100}%` }}></div>

            {/* Mobile Vertical Line */}
            <div className="md:hidden absolute left-10 top-0 bottom-0 w-1 bg-[#2A1A1F] z-0"></div>
            <div className="md:hidden absolute left-10 top-0 w-1 bg-[#7C1D35] transition-all duration-1000 z-0 shadow-[0_0_10px_#7C1D35]" style={{ height: `${(Math.max(0, currentStatusIndex) / 3) * 100}%` }}></div>

            {[
              { label: "Pending", icon: <Clock className="w-5 h-5" /> },
              { label: "Preparing", icon: <Package className="w-5 h-5" /> },
              { label: "On the Way", icon: <MapPin className="w-5 h-5" /> },
              { label: "Delivered", icon: <CheckCircle className="w-5 h-5" /> },
            ].map((step, i) => (
              <div key={i} className="relative z-10 flex flex-row md:flex-col items-center gap-6 md:gap-4 w-full md:w-auto">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center border-2 transition-all duration-500 shadow-lg
                  ${currentStatusIndex >= i 
                    ? "bg-[#7C1D35] text-[#F5F0E8] border-[#7C1D35]" 
                    : "bg-[#0A0A0A] text-gray-500 border-[#2A1A1F]"}`}
                >
                  {step.icon}
                </div>
                <span className={`font-bold uppercase tracking-widest text-[10px] md:text-xs text-center
                  ${currentStatusIndex >= i ? "text-[#C9A84C]" : "text-gray-600"}`}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#111111] print:bg-white border border-[#2A1A1F] print:border-none rounded-3xl p-8 md:p-12 shadow-xl print:shadow-none print:p-0 relative">
          <div className="hidden print:block absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-10 pointer-events-none rotate-[-30deg]">
            <span className="font-[family-name:var(--font-playfair)] text-8xl font-black text-black tracking-widest border-8 border-black p-4 rounded-xl">
              [ PAID IN FULL ]
            </span>
          </div>
          
          <h2 className="font-[family-name:var(--font-playfair)] text-2xl font-bold mb-8 border-b border-[#2A1A1F] print:border-gray-300 pb-4 text-[#F5F0E8] print:text-black">Receipt</h2>
          <div className="space-y-6 mb-8">
            {items.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center text-sm md:text-base">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 rounded-full bg-[#2A1A1F] print:bg-gray-100 text-[#C9A84C] print:text-black flex items-center justify-center font-bold">{item.quantity}x</span>
                  <span className="font-medium text-[#F5F0E8] print:text-black">{item.name}</span>
                </div>
                <span className="text-gray-400 print:text-black font-medium">${(Number(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          
          <div className="hidden print:flex justify-between items-end pt-4 mb-2">
            <span className="text-black uppercase tracking-widest text-xs font-bold">Subtotal</span>
            <span className="text-black">${(Number(orderInfo.totalAmount) / 1.08).toFixed(2)}</span>
          </div>
          <div className="hidden print:flex justify-between items-end pb-4 border-b border-gray-300 mb-4">
            <span className="text-black uppercase tracking-widest text-xs font-bold">Tax (8%)</span>
            <span className="text-black">${(Number(orderInfo.totalAmount) - (Number(orderInfo.totalAmount) / 1.08)).toFixed(2)}</span>
          </div>

          <div className="flex justify-between items-end pt-8 print:pt-4 border-t border-[#2A1A1F] print:border-none">
            <span className="text-gray-400 print:text-black uppercase tracking-widest text-xs font-bold">Total Paid</span>
            <span className="font-[family-name:var(--font-playfair)] text-4xl font-bold text-[#C9A84C] print:text-black">${Number(orderInfo.totalAmount).toFixed(2)}</span>
          </div>
        </div>

        <div className="mt-12 text-center print:hidden">
          <Link href="/menu" className="inline-flex items-center text-gray-400 hover:text-[#C9A84C] transition font-bold uppercase tracking-widest text-sm">
            <Clock className="w-4 h-4 mr-2" /> Place Another Order
          </Link>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; color: black !important; }
          nav, footer, header { display: none !important; }
        }
      `}} />
    </div>
  );
}
