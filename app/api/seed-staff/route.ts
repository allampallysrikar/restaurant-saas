import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const email = "admin@xyz.com";
    const password = "adminpassword123";

    // Check if exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ message: "Staff user already exists!" });
    }

    // Use Better Auth directly
    const res = await auth.api.signUpEmail({
      body: {
        email,
        password,
        name: "Admin Staff",
      }
    });

    if (res?.user?.id) {
      // Manually promote to staff in DB
      await prisma.user.update({
        where: { id: res.user.id },
        data: { role: "STAFF" }
      });
      return NextResponse.json({ success: true, message: "Staff user created successfully!" });
    } else {
      return NextResponse.json({ success: false, error: "Failed to create user" });
    }
  } catch (err) {
    console.error(err);
    return NextResponse.json({ success: false, error: "Seed failed" }, { status: 500 });
  }
}
