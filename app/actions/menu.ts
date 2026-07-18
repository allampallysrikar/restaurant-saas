"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function getLiveMenu() {
  return await prisma.menuItem.findMany({
    include: { category: true },
    orderBy: { createdAt: "asc" }
  });
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  await prisma.menuItem.update({
    where: { id },
    data: { isAvailable }
  });
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}
