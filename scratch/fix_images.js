require('dotenv').config();
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const images = [
  '/demo/saree_red.png',
  '/demo/kurta_blue.png',
  '/demo/saree_green.png',
  '/demo/dupatta_yellow.png'
];

async function main() {
  const products = await prisma.product.findMany();
  
  for (let i = 0; i < products.length; i++) {
    // Pick an image based on the index or the name
    let imgIndex = i % 4;
    
    // Attempt to match smartly if the product code gives a hint
    if (products[i].code.includes('KUR')) imgIndex = 1; // kurta_blue
    else if (products[i].code.includes('DUP')) imgIndex = 3; // dupatta_yellow
    else if (products[i].code.includes('SAR')) imgIndex = i % 2 === 0 ? 0 : 2; // saree red or green
    
    await prisma.product.update({
      where: { id: products[i].id },
      data: { images: [images[imgIndex]] }
    });
  }
  console.log('Successfully updated product images with premium generated AI images.');
}

main()
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect());
