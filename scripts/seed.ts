import "dotenv/config";
import { prisma } from '../lib/prisma';

async function main() {
  console.log("Seeding database...");
  const count = await prisma.category.count();
  if (count > 0) {
    console.log("Database already seeded!");
    return;
  }

  const c1 = await prisma.category.create({ data: { name: "Starters" } });
  const c2 = await prisma.category.create({ data: { name: "Mains" } });
  const c3 = await prisma.category.create({ data: { name: "Desserts" } });
  const c4 = await prisma.category.create({ data: { name: "Beverages" } });

  await prisma.menuItem.createMany({
    data: [
      { name: "Truffle Arancini", description: "Crispy risotto balls with black truffle and mozzarella.", price: 18, categoryId: c1.id, image: "https://images.unsplash.com/photo-1541529086526-db283c563270?w=500&q=80" },
      { name: "Wagyu Ribeye", description: "A5 Grade Wagyu beef with roasted root vegetables.", price: 85, categoryId: c2.id, image: "https://images.unsplash.com/photo-1544025162-83b3e21e4281?w=500&q=80" },
      { name: "Lobster Ravioli", description: "Handmade pasta stuffed with fresh lobster in saffron cream sauce.", price: 34, categoryId: c2.id, image: "https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=500&q=80" },
      { name: "Matcha Tiramisu", description: "Traditional Italian dessert with a Japanese twist.", price: 14, categoryId: c3.id, image: "https://images.unsplash.com/photo-1571115177098-24de63f25c27?w=500&q=80" },
    ]
  });
  console.log("Seeding complete!");
}

main().catch(console.error).finally(() => prisma.$disconnect());
