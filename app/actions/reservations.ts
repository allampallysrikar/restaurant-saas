"use server";

import { neon } from "@neondatabase/serverless";
import { revalidatePath } from "next/cache";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
  if (!url) throw new Error("DATABASE_URL not set");
  return neon(url);
}

export async function createReservation(data: {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  date: string;
  time: string;
  guestsCount: number;
  specialReq?: string;
}) {
  try {
    const sql = getDb();
    const [reservation] = await sql`
      INSERT INTO "Reservation" (id, "guestName", "guestEmail", "guestPhone", date, time, "guestsCount", status, "specialReq", "createdAt", "updatedAt")
      VALUES (
        gen_random_uuid(),
        ${data.guestName},
        ${data.guestEmail},
        ${data.guestPhone || ""},
        ${new Date(data.date).toISOString()},
        ${data.time},
        ${Number(data.guestsCount)},
        'PENDING',
        ${data.specialReq || ""},
        NOW(),
        NOW()
      )
      RETURNING id
    `;
    revalidatePath("/admin/reservations");
    return { success: true, reservation: { id: reservation.id } };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    return { success: false, error: "Database error creating reservation" };
  }
}

export async function getLiveReservations() {
  try {
    const sql = getDb();
    const reservations = await sql`
      SELECT id, "guestName", "guestEmail", "guestPhone", date, time, "guestsCount", status, "specialReq", "createdAt"
      FROM "Reservation"
      ORDER BY "createdAt" DESC
    `;
    return reservations;
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    return [];
  }
}

export async function updateReservationStatus(id: string, status: string) {
  try {
    const sql = getDb();
    await sql`UPDATE "Reservation" SET status = ${status}, "updatedAt" = NOW() WHERE id = ${id}`;
    revalidatePath("/admin/reservations");
    return { success: true };
  } catch (error) {
    console.error("Failed to update reservation status:", error);
    return { success: false, error: "Database update failed" };
  }
}
