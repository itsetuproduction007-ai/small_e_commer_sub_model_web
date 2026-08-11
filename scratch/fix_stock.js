require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const result = await prisma.product.updateMany({
    data: { stock: 5 }
  });
  console.log('Updated', result);
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
