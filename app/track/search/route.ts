import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const orderCode = searchParams.get('order')?.trim().toUpperCase()

  if (!orderCode) {
    return NextResponse.redirect(new URL('/track?error=missing', request.url))
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderCode }
    })

    if (!order) {
      return NextResponse.redirect(new URL('/track?error=not_found', request.url))
    }

    // Redirect to the actual tracking page using the secret token
    return NextResponse.redirect(new URL(`/track/${order.trackingToken}`, request.url))
  } catch (error) {
    console.error('Error looking up order:', error)
    return NextResponse.redirect(new URL('/track?error=error', request.url))
  }
}
