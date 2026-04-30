import 'dotenv/config';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { seeds } from './seeds';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is required for seeding');
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString }),
});

async function main(): Promise<void> {
  for (const seed of seeds) {
    await seed(prisma);
  }
}

main()
  .catch((error: unknown) => {
    console.error('Seeding failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
