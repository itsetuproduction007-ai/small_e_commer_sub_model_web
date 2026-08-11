import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/staff/order/[token]'>
) {
  const { token } = await ctx.params
  try {
    const order = await prisma.order.findUnique({
      where: { staffToken: token },
      select: {
        id: true, orderCode: true, status: true, totalAmount: true,
        paymentRef: true, paymentStatus: true, createdAt: true, updatedAt: true,
        trackingToken: true,
        customer: {
          select: { name: true, phone: true, email: true, address: true, pincode: true, city: true, state: true },
        },
        items: {
          include: { product: { select: { code: true, name: true } } },
        },
        statusHistory: { orderBy: { createdAt: 'asc' } },
      },
    })
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 })
    return NextResponse.json(order)
  } catch (error) {
    console.error('Staff order API error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
