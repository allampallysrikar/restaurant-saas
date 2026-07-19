import { PrismaClient } from '@prisma/client';
import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

declare global {
  // eslint-disable-next-line no-var
  var __prisma: PrismaClient | undefined;
}

function getPrisma(): PrismaClient {
  if (global.__prisma) return global.__prisma;

  const connectionString =
    process.env.DATABASE_URL ||
    process.env.DATABASE_URL_UNPOOLED ||
    "";

  if (!connectionString) {
    throw new Error(
      "DATABASE_URL is not set. Add it in Vercel Settings → Environment Variables and redeploy."
    );
  }

  const pool = new Pool({ connectionString });
  // @ts-expect-error - PrismaNeon type mismatch with Neon Pool
  const adapter = new PrismaNeon(pool);
  const client = new PrismaClient({ adapter });

  // Only cache globally in dev to prevent hot-reload leaks
  if (process.env.NODE_ENV !== 'production') {
    global.__prisma = client;
  }

  return client;
}

// Export as a getter proxy so every property access creates/reuses client at call time
export const prisma = new Proxy({} as PrismaClient, {
  get(_target, prop) {
    return (getPrisma() as any)[prop];
  },
});
