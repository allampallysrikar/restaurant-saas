import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Check if seeded
    const existing = await prisma.category.count();
    if (existing > 0) {
      return NextResponse.json({ message: "Already seeded" });
    }

    const c1 = await prisma.category.create({ data: { name: "Starters" } });
    const c2 = await prisma.category.create({ data: { name: "Mains" } });
    const c3 = await prisma.category.create({ data: { name: "Desserts" } });

    await prisma.menuItem.createMany({
      data: [
        { name: "Truffle Arancini", description: "Crispy risotto balls with black truffle.", price: 18, categoryId: c1.id, image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80" },
        { name: "Wagyu Ribeye", description: "A5 Grade Wagyu beef.", price: 85, categoryId: c2.id, image: "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=500&q=80" },
        { name: "Lobster Ravioli", description: "Handmade pasta stuffed with fresh lobster.", price: 34, categoryId: c2.id, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80" },
        { name: "Matcha Tiramisu", description: "Traditional Italian dessert with a Japanese twist.", price: 14, categoryId: c3.id, image: "https://images.unsplash.com/photo-1571115177098-24de63f25c27?w=500&q=80" },
      ]
    });

    return NextResponse.json({ success: true, message: "Database seeded!" });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Seed failed" }, { status: 500 });
  }
}
