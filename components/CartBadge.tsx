"use client";

import { useCartStore } from "@/features/cart/store";
import { useEffect, useState } from "react";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";

export function CartBadge() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <Link href="/cart" className="relative text-cream hover:text-gold transition-colors flex items-center gap-2 py-2 px-3 rounded-lg hover:bg-white/5">
      <div className="relative">
        <ShoppingBag className="w-5 h-5" />
        {mounted && count > 0 && (
          <span className="absolute -top-2 -right-2 bg-[#C9A84C] text-[#0A0A0A] text-[10px] font-black rounded-full w-5 h-5 flex items-center justify-center border-2 border-[#0A0A0A] shadow-md animate-bounce">
            {count}
          </span>
        )}
      </div>
      <span className="text-sm font-medium tracking-wide">Cart</span>
    </Link>
  );
}
