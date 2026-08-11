import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function GET(
  _req: Request,
  ctx: RouteContext<'/api/products/[code]'>
) {
  const { code } = await ctx.params
  try {
    const product = await prisma.product.findUnique({
      where: { code: code.toUpperCase() },
      select: {
        id: true, code: true, name: true, price: true, stock: true,
        images: true, fabric: true, length: true, blousePiece: true,
        description: true, instagramUrl: true,
      },
    })
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 })
    return NextResponse.json(product)
  } catch (error) {
    console.error('Product API error:', error)
    return NextResponse.json({ error: 'Database error' }, { status: 500 })
  }
}
