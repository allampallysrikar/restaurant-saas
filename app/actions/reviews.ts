"use server";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

export async function getReviewsForMenuItem(menuItemId: string) {
  const sql = getDb();
  try {
    const rows = await sql`
      SELECT id, rating, comment, "createdAt" 
      FROM "Review" 
      WHERE comment LIKE ${'%' + menuItemId + '%'} OR "isApproved" = true
      ORDER BY "createdAt" DESC LIMIT 10
    `;
    return rows;
  } catch (err) {
    console.error("Error fetching reviews:", err);
    return [];
  }
}

export async function createReview(menuItemId: string, rating: number, comment: string, userName: string) {
  const sql = getDb();
  try {
    const fullComment = `[Item: ${menuItemId}] [User: ${userName}] ${comment}`;
    await sql`
      INSERT INTO "Review" (id, rating, comment, "isApproved", "createdAt", "updatedAt")
      VALUES (${'rev_' + Math.random().toString(36).substring(2, 11)}, ${rating}, ${fullComment}, true, NOW(), NOW())
    `;
    return { success: true };
  } catch (err) {
    console.error("Error creating review:", err);
    return { success: false, error: "Failed to submit review" };
  }
}
