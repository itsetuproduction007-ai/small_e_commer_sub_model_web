import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import { v4 as uuidv4 } from 'uuid'
import dotenv from 'dotenv'

dotenv.config()

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! })
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database...')

  // Create demo products
  const products = [
    {
      code: 'RER-SAR-001',
      name: 'Sungudi Zari Checked Saree',
      description: 'A stunning Sungudi saree with traditional zari checked pattern. The soft cotton fabric makes it perfect for both festive occasions and daily wear. Features elegant zari border.',
      price: 1299,
      stock: 5,
      images: [],
      fabric: 'Soft cotton',
      length: '6.5m',
      blousePiece: true,
    },
    {
      code: 'RER-SAR-002',
      name: 'Onam Special Kasavu Saree',
      description: 'Traditional Kerala Kasavu saree with gold zari border. Perfect for Onam celebrations, temple visits, and festive occasions. A timeless classic.',
      price: 1899,
      stock: 3,
      images: [],
      fabric: 'Pure cotton',
      length: '6.2m',
      blousePiece: true,
    },
    {
      code: 'RER-SAR-003',
      name: 'Rose Pink Block Print Cotton Saree',
      description: 'Beautiful rose pink saree with hand block print design. Light and breezy cotton fabric, ideal for daytime and office wear.',
      price: 999,
      stock: 8,
      images: [],
      fabric: 'Cotton',
      length: '6.3m',
      blousePiece: false,
    },
    {
      code: 'RER-SAR-004',
      name: 'Indigo Resist Dyed Saree',
      description: 'Handcrafted indigo resist dyed saree. Each piece is unique. Artisan made, supporting traditional Indian dyeing techniques.',
      price: 1599,
      stock: 2,
      images: [],
      fabric: 'Cotton',
      length: '6.5m',
      blousePiece: false,
    },
    {
      code: 'RER-KUR-001',
      name: 'Ajrakh Print Kurta',
      description: 'Elegant Ajrakh block print kurta in earthy tones. Comfortable cotton fabric suitable for all seasons.',
      price: 799,
      stock: 0,
      images: [],
      fabric: 'Cotton',
      length: null,
      blousePiece: false,
    },
    {
      code: 'RER-KUR-002',
      name: 'Kalamkari Floral Kurta',
      description: 'Hand painted Kalamkari floral kurta. Traditional South Indian art form. Each piece is a work of art.',
      price: 1099,
      stock: 6,
      images: [],
      fabric: 'Cotton',
      length: null,
      blousePiece: false,
    },
  ]

  for (const product of products) {
    await prisma.product.upsert({
      where: { code: product.code },
      update: {},
      create: { ...product, isPublished: true, isDraft: false },
    })
    console.log(`  ✅ Product: ${product.code} — ${product.name}`)
  }

  // Create a demo customer and order for testing
  const customer = await prisma.customer.upsert({
    where: { code: 'CUS-0001' },
    update: {},
    create: {
      code: 'CUS-0001',
      name: 'Priya Nair',
      phone: '9876543210',
      email: 'priya@example.com',
      address: '12, MG Road, Ernakulam',
      pincode: '682011',
      city: 'Kochi',
      state: 'Kerala',
    },
  })
  console.log('  ✅ Demo customer: CUS-0001')

  const productForOrder = await prisma.product.findUnique({ where: { code: 'RER-SAR-001' } })
  if (productForOrder) {
    await prisma.order.upsert({
      where: { orderCode: 'RER-ORD-1025' },
      update: {},
      create: {
        orderCode: 'RER-ORD-1025',
        customerId: customer.id,
        status: 'CONFIRMED',
        totalAmount: productForOrder.price,
        paymentRef: 'TXN123456789012',
        paymentStatus: 'PAID',
        trackingToken: uuidv4(),
        staffToken: uuidv4(),
        items: {
          create: [{
            productId: productForOrder.id,
            quantity: 1,
            price: productForOrder.price,
          }],
        },
        statusHistory: {
          create: [
            { status: 'PENDING', note: 'Order placed', createdAt: new Date(Date.now() - 3600000 * 2) },
            { status: 'CONFIRMED', note: 'Payment verified', createdAt: new Date(Date.now() - 3600000) },
          ],
        },
      },
    })
    console.log('  ✅ Demo order: RER-ORD-1025')
  }

  console.log('\n🎉 Seeding complete!')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
