import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

// Setup Neon Serverless Driver
neonConfig.webSocketConstructor = ws;
const connectionString = process.env.DATABASE_URL || process.env.DATABASE_URL_UNPOOLED || "";
const pool = new Pool({ connectionString });
// @ts-expect-error - PrismaNeon type mismatch with Neon Pool
const adapter = new PrismaNeon(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
