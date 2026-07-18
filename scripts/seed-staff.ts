import "dotenv/config";
import { prisma } from '../lib/prisma';
import { auth } from "../lib/auth";

async function main() {
  console.log("Creating admin staff user...");
  // Normally Better Auth handles password hashing. Since we can't import better auth's server directly in a raw script without polyfills sometimes, we can try using the auth instance.
  
  const email = "admin@xyz.com";
  const password = "adminpassword123";

  // Check if exists
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log("Staff user already exists!");
    return;
  }

  // Use Better Auth directly to sign up the user so it hashes the password correctly!
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
    console.log("Staff user created successfully!");
    console.log("Email: " + email);
    console.log("Password: " + password);
  } else {
    console.error("Failed to create user", res);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
