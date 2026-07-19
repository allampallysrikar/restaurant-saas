"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

export async function getLiveMenu() {
  try {
    const sql = getDb();
    const items = await sql`
      SELECT 
        m.id, m.name, m.description, m.price, m.image, m."isAvailable", m."categoryId",
        c.id as "cat_id", c.name as "cat_name"
      FROM "MenuItem" m
      LEFT JOIN "Category" c ON c.id = m."categoryId"
      WHERE m."isAvailable" = true
      ORDER BY c."order" ASC, m."createdAt" ASC
    `;
    return items.map((row: any) => ({
      id: row.id,
      name: row.name,
      description: row.description,
      price: row.price,
      image: row.image,
      isAvailable: row.isAvailable,
      categoryId: row.categoryId,
      category: { id: row.cat_id, name: row.cat_name },
    }));
  } catch (err) {
    console.error("getLiveMenu error:", err);
    return [];
  }
}

export async function toggleMenuItemAvailability(id: string, isAvailable: boolean) {
  const sql = getDb();
  await sql`UPDATE "MenuItem" SET "isAvailable" = ${isAvailable}, "updatedAt" = NOW() WHERE id = ${id}`;
  revalidatePath("/admin/menu");
  revalidatePath("/menu");
}
