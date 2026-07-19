import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  const dbUrl = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED;

  if (!dbUrl) {
    return NextResponse.json({
      success: false,
      error: "No DATABASE_URL found",
      env_keys: Object.keys(process.env).filter(k => k.includes("DATABASE") || k.includes("NEON") || k.includes("POSTGRES")),
      hint: "Add DATABASE_URL in Vercel Settings → Environment Variables, then Redeploy"
    }, { status: 500 });
  }

  try {
    const sql = neon(dbUrl);

    // Wipe and reseed using raw SQL — bypasses Prisma adapter entirely
    await sql`DELETE FROM "OrderItem"`;
    await sql`DELETE FROM "CartItem"`;
    await sql`DELETE FROM "MenuItem"`;
    await sql`DELETE FROM "Category"`;

    // Insert categories
    const [c1] = await sql`INSERT INTO "Category" (id, name, "order", "createdAt", "updatedAt") VALUES (gen_random_uuid(), 'Starters', 1, NOW(), NOW()) RETURNING id`;
    const [c2] = await sql`INSERT INTO "Category" (id, name, "order", "createdAt", "updatedAt") VALUES (gen_random_uuid(), 'Mains', 2, NOW(), NOW()) RETURNING id`;
    const [c3] = await sql`INSERT INTO "Category" (id, name, "order", "createdAt", "updatedAt") VALUES (gen_random_uuid(), 'Desserts', 3, NOW(), NOW()) RETURNING id`;
    const [c4] = await sql`INSERT INTO "Category" (id, name, "order", "createdAt", "updatedAt") VALUES (gen_random_uuid(), 'Beverages', 4, NOW(), NOW()) RETURNING id`;

    const items = [
      // Starters
      { name: "Truffle Arancini", desc: "Crispy risotto balls filled with wild mushrooms, black truffle, and molten mozzarella.", price: 18, catId: c1.id, img: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=600&auto=format&fit=crop&q=80" },
      { name: "Burrata & Heirloom Tomatoes", desc: "Creamy pugliese burrata, organic heirloom tomatoes, aged balsamic and micro basil.", price: 22, catId: c1.id, img: "https://images.unsplash.com/photo-1592417817098-8f3d691a4bf5?w=600&auto=format&fit=crop&q=80" },
      { name: "Wagyu Beef Carpaccio", desc: "Paper-thin slices of raw Wagyu tenderloin, crispy capers, shaved parmesan, truffle oil.", price: 26, catId: c1.id, img: "https://images.unsplash.com/photo-1514933651103-005eec06c04b?w=600&auto=format&fit=crop&q=80" },
      { name: "Crispy Calamari", desc: "Lightly battered squid rings with lemon aioli and spicy calabrian chili dip.", price: 19, catId: c1.id, img: "https://images.unsplash.com/photo-1599488615731-7e5c2823ff28?w=600&auto=format&fit=crop&q=80" },
      { name: "French Onion Soup", desc: "Rich caramelized onion broth topped with a crusty baguette and melted gruyère cheese.", price: 16, catId: c1.id, img: "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&auto=format&fit=crop&q=80" },
      // Mains
      { name: "Wagyu Ribeye A5", desc: "12oz Japanese Miyazaki Wagyu ribeye with roasted garlic bone marrow butter.", price: 95, catId: c2.id, img: "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=600&auto=format&fit=crop&q=80" },
      { name: "Lobster Ravioli", desc: "Handmade egg pasta stuffed with sweet Maine lobster in a velvety saffron cream sauce.", price: 38, catId: c2.id, img: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&auto=format&fit=crop&q=80" },
      { name: "Pan-Seared Chilean Sea Bass", desc: "Flaky sea bass over miso-glazed bok choy and ginger dashi broth.", price: 46, catId: c2.id, img: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=600&auto=format&fit=crop&q=80" },
      { name: "Duck Breast à l'Orange", desc: "Crispy-skinned duck breast with caramelized parsnip purée and spiced orange glaze.", price: 42, catId: c2.id, img: "https://images.unsplash.com/photo-1518492104633-130d0cc84637?w=600&auto=format&fit=crop&q=80" },
      { name: "Wild Mushroom Risotto", desc: "Acquerello carnaroli rice with porcini, chanterelles, and parmigiano-reggiano.", price: 32, catId: c2.id, img: "https://images.unsplash.com/photo-1633964913295-ceb43826e7c9?w=600&auto=format&fit=crop&q=80" },
      { name: "Rack of Colorado Lamb", desc: "Herb-crusted lamb chops with rosemary fingerling potatoes and mint jus.", price: 54, catId: c2.id, img: "https://images.unsplash.com/photo-1603360946369-dc9bb6258143?w=600&auto=format&fit=crop&q=80" },
      // Desserts
      { name: "Matcha Tiramisu", desc: "Uji ceremonial matcha layered with mascarpone cream and green tea liqueur ladyfingers.", price: 15, catId: c3.id, img: "https://images.unsplash.com/photo-1571115177098-24de63f25c27?w=600&auto=format&fit=crop&q=80" },
      { name: "Valrhona Chocolate Soufflé", desc: "Warm dark chocolate cake with Madagascar vanilla bean gelato.", price: 18, catId: c3.id, img: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80" },
      { name: "Tahitian Vanilla Crème Brûlée", desc: "Rich vanilla bean custard with a crisp caramelized sugar crust and fresh berries.", price: 14, catId: c3.id, img: "https://images.unsplash.com/photo-1470324161839-ce2bb6fa6bc3?w=600&auto=format&fit=crop&q=80" },
      { name: "Meyer Lemon Tart", desc: "Zesty lemon curd in a shortbread crust topped with toasted Italian meringue.", price: 14, catId: c3.id, img: "https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=600&auto=format&fit=crop&q=80" },
      { name: "Artisan Gelato Trio", desc: "House-made pistachio, hazelnut, and salted caramel gelatos.", price: 12, catId: c3.id, img: "https://images.unsplash.com/photo-1567206563064-6f60f40a2b57?w=600&auto=format&fit=crop&q=80" },
      // Beverages
      { name: "Smoked Old Fashioned", desc: "Small-batch bourbon, angostura bitters, maple syrup, infused with cherrywood smoke.", price: 20, catId: c4.id, img: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?w=600&auto=format&fit=crop&q=80" },
      { name: "Lychee & Rose Martini", desc: "Premium vodka, fresh lychee puree, rose water reduction, garnished with edible petals.", price: 18, catId: c4.id, img: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?w=600&auto=format&fit=crop&q=80" },
      { name: "Sencha Green Tea", desc: "Organic first-flush Japanese green tea brewed at precise temperature.", price: 8, catId: c4.id, img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=600&auto=format&fit=crop&q=80" },
      { name: "Single-Origin Espresso", desc: "Double shot of freshly ground Ethiopian Yirgacheffe beans with rich crema.", price: 6, catId: c4.id, img: "https://images.unsplash.com/photo-1510591509098-f4fdc6d0ff04?w=600&auto=format&fit=crop&q=80" },
    ];

    for (const item of items) {
      await sql`INSERT INTO "MenuItem" (id, name, description, price, "categoryId", image, "isAvailable", "createdAt", "updatedAt")
        VALUES (gen_random_uuid(), ${item.name}, ${item.desc}, ${item.price}, ${item.catId}, ${item.img}, true, NOW(), NOW())`;
    }

    return NextResponse.json({
      success: true,
      message: `Seeded ${items.length} menu items across 4 categories!`,
      using_url: dbUrl.substring(0, 40) + "..."
    });

  } catch (err) {
    return NextResponse.json({
      success: false,
      error: "Seed failed",
      details: err instanceof Error ? err.message : String(err),
    }, { status: 500 });
  }
}
