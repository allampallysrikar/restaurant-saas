"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

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
    const reservation = await prisma.reservation.create({
      data: {
        guestName: data.guestName,
        guestEmail: data.guestEmail,
        guestPhone: data.guestPhone,
        date: new Date(data.date),
        time: data.time,
        guestsCount: Number(data.guestsCount),
        specialReq: data.specialReq || "",
        status: "PENDING",
      },
    });

    revalidatePath("/admin/reservations");
    return { success: true, reservation };
  } catch (error) {
    console.error("Failed to create reservation:", error);
    return { success: false, error: "Database error creating reservation" };
  }
}

export async function getLiveReservations() {
  try {
    const reservations = await prisma.reservation.findMany({
      orderBy: { date: "asc" },
    });
    return reservations;
  } catch (error) {
    console.error("Failed to fetch reservations:", error);
    return [];
  }
}

export async function updateReservationStatus(id: string, status: string) {
  try {
    const updated = await prisma.reservation.update({
      where: { id },
      data: { status },
    });
    revalidatePath("/admin/reservations");
    return { success: true, updated };
  } catch (error) {
    console.error("Failed to update reservation status:", error);
    return { success: false, error: "Database update failed" };
  }
}
