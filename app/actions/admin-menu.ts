"use server";
import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  return neon(url);
}

export async function createMenuItem(data: any) {
  try {
    const sql = getDb();
    await sql`
      INSERT INTO "MenuItem" (id, name, description, price, image, "categoryId", "isAvailable", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${data.name},
        ${data.description},
        ${Number(data.price)},
        ${data.image},
        ${data.categoryId},
        true,
        NOW(),
        NOW()
      )
    `;
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

export async function updateMenuItem(id: string, data: any) {
  try {
    const sql = getDb();
    await sql`
      UPDATE "MenuItem" SET
        name = ${data.name},
        description = ${data.description},
        price = ${Number(data.price)},
        image = ${data.image},
        "categoryId" = ${data.categoryId},
        "updatedAt" = NOW()
      WHERE id = ${id}
    `;
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

export async function deleteMenuItem(id: string) {
  try {
    const sql = getDb();
    await sql`DELETE FROM "MenuItem" WHERE id = ${id}`;
    revalidatePath("/admin/menu");
    revalidatePath("/menu");
    return { success: true };
  } catch (err: any) {
    console.error(err);
    return { success: false, error: err.message };
  }
}

export async function getCategories() {
  try {
    const sql = getDb();
    return await sql`SELECT id, name FROM "Category" ORDER BY "order" ASC`;
  } catch (err) {
    console.error(err);
    return [];
  }
}
