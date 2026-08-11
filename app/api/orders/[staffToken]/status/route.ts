import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'
import { OrderStatus } from '@prisma/client'

// Valid status transitions
const TRANSITIONS: Record<string, OrderStatus[]> = {
  PENDING:   ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PACKED', 'CANCELLED'],
  PACKED:    ['SHIPPED', 'CANCELLED'],
  SHIPPED:   ['DELIVERED'],
  DELIVERED: [],
  CANCELLED: [],
}

export async function PATCH(
  request: Request,
  ctx: RouteContext<'/api/orders/[staffToken]/status'>
) {
  const { staffToken } = await ctx.params
  try {
    const body = await request.json()
    const { status, note } = body as { status: string; note?: string }

    // Find order by staffToken
    const order = await prisma.order.findUnique({
      where: { staffToken },
    })
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    }

    // Validate the transition
    const allowed = TRANSITIONS[order.status] || []
    if (!allowed.includes(status as OrderStatus)) {
      return NextResponse.json({
        error: `Cannot transition from ${order.status} to ${status}. Allowed: ${allowed.join(', ') || 'none'}`,
      }, { status: 400 })
    }

    // Also handle payment confirmation when moving to CONFIRMED
    const paymentUpdate = status === 'CONFIRMED'
      ? { paymentStatus: 'PAID' as const }
      : {}

    const updated = await prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.order.update({
        where: { staffToken },
        data: {
          status: status as OrderStatus,
          ...paymentUpdate,
          statusHistory: {
            create: [{
              status: status as OrderStatus,
              note: note || null,
            }],
          },
        },
        include: {
          customer: { select: { name: true, phone: true } },
          items: { include: { product: { select: { name: true, code: true } } } },
        },
      })
      return updatedOrder
    })

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const trackingUrl = `${baseUrl}/track/${order.trackingToken}`
    const waPhone = updated.customer.phone.replace(/\D/g, '')

    // Build a status-appropriate WhatsApp message for the customer
    const statusMessages: Record<string, string> = {
      CONFIRMED: `✅ Order Confirmed — ${updated.orderCode}\n\nHi ${updated.customer.name}! Your payment has been verified and your order is confirmed.\n\nTrack your order: ${trackingUrl}`,
      PACKED: `📦 Order Packed — ${updated.orderCode}\n\nHi ${updated.customer.name}! Your order has been packed and will be shipped soon.\n\nTrack: ${trackingUrl}`,
      SHIPPED: `🚚 Shipped — ${updated.orderCode}\n\nHi ${updated.customer.name}! Your order is on its way!\n\nTrack: ${trackingUrl}`,
      DELIVERED: `🎉 Delivered — ${updated.orderCode}\n\nHi ${updated.customer.name}! Your order has been delivered. We hope you love it! 💕`,
      CANCELLED: `❌ Order Cancelled — ${updated.orderCode}\n\nHi ${updated.customer.name}, your order has been cancelled. Please contact us if this was a mistake.`,
    }

    const waMessage = statusMessages[status] || `Order ${updated.orderCode} updated to: ${status}`

    return NextResponse.json({
      success: true,
      order: {
        orderCode: updated.orderCode,
        status: updated.status,
        paymentStatus: updated.paymentStatus,
      },
      whatsappCustomerUrl: `https://wa.me/${waPhone}?text=${encodeURIComponent(waMessage)}`,
    })
  } catch (error) {
    console.error('Order status update error:', error)
    return NextResponse.json({ error: 'Failed to update order status' }, { status: 500 })
  }
}
