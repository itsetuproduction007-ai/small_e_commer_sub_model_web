import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import { generateOrderCode, generateCustomerCode, generateStaffOrderMessage, generateCustomerConfirmationMessage } from '@/lib/utils'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productCode, customer, paymentRef } = body

    // Validate required fields
    if (!productCode || !customer?.name || !customer?.phone || !customer?.address || !customer?.pincode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Find the product
    const product = await prisma.product.findUnique({
      where: { code: productCode.toUpperCase() },
    })
    if (!product) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    }
    if (product.stock <= 0) {
      return NextResponse.json({ error: 'Product is out of stock' }, { status: 409 })
    }

    // Generate customer code: count existing customers first
    const customerCount = await prisma.customer.count()
    const customerCode = generateCustomerCode(customerCount + 1)

    // Generate order code
    const orderCount = await prisma.order.count()
    const orderCode = generateOrderCode(1025 + orderCount) // start from 1025

    // Generate secure tokens
    const trackingToken = uuidv4()
    const staffToken = uuidv4()

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'

    // Create everything in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // Upsert customer (phone as unique identifier)
      const existingCustomer = await tx.customer.findFirst({
        where: { phone: customer.phone },
      })

      const dbCustomer = existingCustomer
        ? await tx.customer.update({
            where: { id: existingCustomer.id },
            data: {
              name: customer.name,
              email: customer.email || null,
              address: customer.address,
              pincode: customer.pincode,
              city: customer.city || null,
              state: customer.state || null,
            },
          })
        : await tx.customer.create({
            data: {
              code: customerCode,
              name: customer.name,
              phone: customer.phone,
              email: customer.email || null,
              address: customer.address,
              pincode: customer.pincode,
              city: customer.city || null,
              state: customer.state || null,
            },
          })

      // Create the order
      const newOrder = await tx.order.create({
        data: {
          orderCode,
          customerId: dbCustomer.id,
          status: 'PENDING',
          totalAmount: product.price,
          paymentRef: paymentRef || null,
          paymentStatus: paymentRef ? 'PENDING_VERIFICATION' : 'UNPAID',
          trackingToken,
          staffToken,
          items: {
            create: [{
              productId: product.id,
              quantity: 1,
              price: product.price,
            }],
          },
          statusHistory: {
            create: [{
              status: 'PENDING',
              note: 'Order placed by customer',
            }],
          },
        },
      })

      // Decrease stock
      await tx.product.update({
        where: { id: product.id },
        data: { stock: { decrement: 1 } },
      })

      return newOrder
    })

    // Generate WhatsApp and tracking URLs for the response
    const trackingUrl = `${baseUrl}/track/${trackingToken}`
    const staffUrl = `${baseUrl}/sales/order/${staffToken}`

    return NextResponse.json({
      success: true,
      orderCode: order.orderCode,
      trackingToken: order.trackingToken,
      trackingUrl,
      staffUrl,
      // Pre-built WhatsApp URLs for staff to send manually
      whatsappUrls: {
        staffAlert: `https://wa.me/${process.env.WHATSAPP_PHONE || '919876543210'}?text=${encodeURIComponent(
          generateStaffOrderMessage(orderCode, [product.name], customer.name, staffUrl)
        )}`,
        customerConfirmation: `https://wa.me/${customer.phone.replace(/\D/g, '')}?text=${encodeURIComponent(
          generateCustomerConfirmationMessage(orderCode, customer.name, trackingUrl)
        )}`,
      },
    }, { status: 201 })

  } catch (error) {
    console.error('Order creation error:', error)
    return NextResponse.json({ error: 'Failed to create order. Please try again.' }, { status: 500 })
  }
}
