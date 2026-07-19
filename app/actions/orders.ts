"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

export async function createOrder(items: { id: string, quantity: number, price: number }[], total: number) {
  try {
    const sql = getDb();
    const [order] = await sql`
      INSERT INTO "Order" (id, "totalAmount", status, "createdAt", "updatedAt")
      VALUES (gen_random_uuid(), ${total}, 'PENDING', NOW(), NOW())
      RETURNING id
    `;
    for (const item of items) {
      await sql`
        INSERT INTO "OrderItem" (id, "orderId", "menuItemId", quantity, "priceAtTime")
        VALUES (gen_random_uuid(), ${order.id}, ${item.id}, ${item.quantity}, ${item.price})
      `;
    }
    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getLiveOrders() {
  try {
    const sql = getDb();
    const orders = await sql`
      SELECT 
        o.id, o.status, o."totalAmount", o."createdAt",
        oi.id as "item_id", oi.quantity, oi."priceAtTime",
        m.name as "item_name"
      FROM "Order" o
      LEFT JOIN "OrderItem" oi ON oi."orderId" = o.id
      LEFT JOIN "MenuItem" m ON m.id = oi."menuItemId"
      ORDER BY o."createdAt" DESC
    `;

    // Group by order
    const orderMap: Record<string, any> = {};
    for (const row of orders) {
      if (!orderMap[row.id]) {
        orderMap[row.id] = {
          id: row.id,
          status: row.status,
          totalAmount: row.totalAmount,
          createdAt: row.createdAt,
          items: [],
        };
      }
      if (row.item_id) {
        orderMap[row.id].items.push({
          id: row.item_id,
          quantity: row.quantity,
          priceAtTime: row.priceAtTime,
          menuItem: { name: row.item_name },
        });
      }
    }
    return Object.values(orderMap);
  } catch (err) {
    console.error("getLiveOrders error:", err);
    return [];
  }
}

export async function updateOrderStatus(orderId: string, status: string) {
  const sql = getDb();
  await sql`UPDATE "Order" SET status = ${status}, "updatedAt" = NOW() WHERE id = ${orderId}`;
  revalidatePath("/admin/orders");
}
