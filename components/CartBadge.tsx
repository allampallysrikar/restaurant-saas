"use client";

import { useCartStore } from "@/features/cart/store";
import { useEffect, useState } from "react";
import { ShoppingCart } from "lucide-react";

export function CartBadge() {
  const items = useCartStore((state) => state.items);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  const count = items.reduce((acc, item) => acc + item.quantity, 0);

  return (
    <a href="/cart" className="relative hover:text-white transition flex items-center">
      <ShoppingCart className="w-4 h-4 mr-1" />
      Cart
      {mounted && count > 0 && (
        <span className="absolute -top-2 -right-3 bg-white text-black text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
          {count}
        </span>
      )}
    </a>
  );
}
