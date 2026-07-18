"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function createOrder(items: { id: string, quantity: number, price: number }[], total: number) {
  try {
    const order = await prisma.order.create({
      data: {
        totalAmount: total,
        status: "PENDING",
        items: {
          create: items.map(item => ({
            menuItem: { connect: { id: item.id } },
            quantity: item.quantity,
            priceAtTime: item.price
          }))
        }
      }
    });
    
    revalidatePath("/admin/orders");
    return { success: true, orderId: order.id };
  } catch (error) {
    console.error("Order creation failed:", error);
    return { success: false, error: "Failed to create order" };
  }
}

export async function getLiveOrders() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: {
        include: { menuItem: true }
      }
    }
  });
  return orders;
}

export async function updateOrderStatus(orderId: string, status: string) {
  await prisma.order.update({
    where: { id: orderId },
    data: { status }
  });
  revalidatePath("/admin/orders");
}
