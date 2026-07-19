import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

function createPrismaClient() {
  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    "";

  if (!connectionString) {
    throw new Error("DATABASE_URL is not set. Add it to your Vercel Environment Variables and redeploy.");
  }

  const pool = new Pool({ connectionString });
  // @ts-expect-error - PrismaNeon type mismatch with Neon Pool
  const adapter = new PrismaNeon(pool);
  return new PrismaClient({ adapter });
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
