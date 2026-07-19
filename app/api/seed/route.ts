import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Clear existing menu and categories for clean re-seed of 20 items
    await prisma.orderItem.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.menuItem.deleteMany();
    await prisma.category.deleteMany();

    const c1 = await prisma.category.create({ data: { name: "Starters", order: 1 } });
    const c2 = await prisma.category.create({ data: { name: "Mains", order: 2 } });
    const c3 = await prisma.category.create({ data: { name: "Desserts", order: 3 } });
    const c4 = await prisma.category.create({ data: { name: "Beverages", order: 4 } });

    await prisma.menuItem.createMany({
      data: [
        // Starters (5 items)
        { name: "Truffle Arancini", description: "Crispy risotto balls filled with wild mushrooms, black truffle, and molten mozzarella.", price: 18, categoryId: c1.id, image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80" },
        { name: "Burrata & Heirloom Tomatoes", description: "Creamy pugliese burrata, organic heirloom tomatoes, aged balsamic reduction, and micro basil.", price: 22, categoryId: c1.id, image: "https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?w=600&auto=format&fit=crop&q=80" },
        { name: "Wagyu Beef Carpaccio", description: "Paper-thin slices of raw Wagyu tenderloin, crispy capers, shaved parmesan, and truffle oil.", price: 26, categoryId: c1.id, image: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80" },
        { name: "Crispy Calamari", description: "Lightly battered squid rings with lemon aioli and spicy calabrian chili dip.", price: 19, categoryId: c1.id, image: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80" },
        { name: "French Onion Soup", description: "Rich caramelized onion broth topped with a crusty baguette and melted gruyère cheese.", price: 16, categoryId: c1.id, image: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80" },

        // Mains (6 items)
        { name: "Wagyu Ribeye A5", description: "12oz Japanese Miyazaki Wagyu ribeye cooked to perfection with roasted garlic bone marrow butter.", price: 95, categoryId: c2.id, image: "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80" },
        { name: "Lobster Ravioli", description: "Handmade egg pasta pillows stuffed with sweet Maine lobster in a velvety saffron cream sauce.", price: 38, categoryId: c2.id, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80" },
        { name: "Pan-Seared Chilean Sea Bass", description: "Flaky sea bass filet over miso-glazed bok choy and ginger dashi broth.", price: 46, categoryId: c2.id, image: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80" },
        { name: "Duck Breast à l'Orange", description: "Crispy-skinned duck breast served with caramelized parsnip purée and spiced orange glaze.", price: 42, categoryId: c2.id, image: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&auto=format&fit=crop&q=80" },
        { name: "Wild Mushroom Risotto", description: "Acquerello carnaroli rice simmered with porcini, chanterelles, and parmigiano-reggiano.", price: 32, categoryId: c2.id, image: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80" },
        { name: "Rack of Colorado Lamb", description: "Herb-crusted lamb chops accompanied by rosemary fingerling potatoes and mint jus.", price: 54, categoryId: c2.id, image: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80" },

        // Desserts (5 items)
        { name: "Matcha Tiramisu", description: "Uji ceremonial matcha layered with mascarpone cream and ladyfingers soaked in green tea liqueur.", price: 15, categoryId: c3.id, image: "https://images.unsplash.com/photo-1571115177098-24de63f25c27?w=600&auto=format&fit=crop&q=80" },
        { name: "Valrhona Chocolate Soufflé", description: "Warm molten dark chocolate cake served alongside Madagascar vanilla bean gelato.", price: 18, categoryId: c3.id, image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80" },
        { name: "Tahitian Vanilla Crème Brûlée", description: "Rich vanilla bean custard with a crisp caramelized sugar crust and fresh berries.", price: 14, categoryId: c3.id, image: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&auto=format&fit=crop&q=80" },
        { name: "Meyer Lemon Tart", description: "Zesty lemon curd in a shortbread crust topped with toasted Italian meringue.", price: 14, categoryId: c3.id, image: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&auto=format&fit=crop&q=80" },
        { name: "Artisan Gelato Trio", description: "Selection of house-made pistachio, hazelnut, and salted caramel gelatos.", price: 12, categoryId: c3.id, image: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&auto=format&fit=crop&q=80" },

        // Beverages (4 items)
        { name: "Smoked Old Fashioned", description: "Small-batch bourbon, angostura bitters, organic maple syrup, infused with cherrywood smoke.", price: 20, categoryId: c4.id, image: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80" },
        { name: "Lychee & Rose Martini", description: "Premium vodka, fresh lychee puree, subtle rose water infused reduction, garnished with edible petals.", price: 18, categoryId: c4.id, image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80" },
        { name: "Sencha Green Tea", description: "Organic first-flush Japanese green tea brewed at precise temperature.", price: 8, categoryId: c4.id, image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80" },
        { name: "Single-Origin Espresso", description: "Double shot of freshly ground Ethiopian Yirgacheffe beans with rich crema.", price: 6, categoryId: c4.id, image: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80" },
      ]
    });

    return NextResponse.json({ success: true, message: "Database seeded successfully with 20 premium items across 4 categories!" });
  } catch (err) {
    console.error("Seed error:", err);
    return NextResponse.json({ 
      success: false, 
      error: "Seed failed", 
      details: err instanceof Error ? err.message : String(err),
      hint: "Make sure DATABASE_URL is added inside your Vercel Project Settings > Environment Variables!"
    }, { status: 500 });
  }
}
