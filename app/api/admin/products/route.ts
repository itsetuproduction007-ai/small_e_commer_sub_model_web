import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { code, name, description, price, stock, images, instagramUrl, fabric, length, blousePiece, isDraft, isPublished } = body

    if (!code || !name) {
      return NextResponse.json({ error: 'Code and name are required' }, { status: 400 })
    }

    const existing = await prisma.product.findUnique({ where: { code: code.toUpperCase() } })
    if (existing) {
      return NextResponse.json({ error: `Product with code ${code} already exists` }, { status: 409 })
    }

    const product = await prisma.product.create({
      data: {
        code: code.toUpperCase(),
        name,
        description: description || null,
        price: parseFloat(price) || 0,
        stock: parseInt(stock) || 0,
        images: images || [],
        instagramUrl: instagramUrl || null,
        fabric: fabric || null,
        length: length || null,
        blousePiece: blousePiece || false,
        isDraft: isDraft !== undefined ? isDraft : false,
        isPublished: isPublished !== undefined ? isPublished : true,
      },
    })

    return NextResponse.json({ success: true, product }, { status: 201 })
  } catch (error) {
    console.error('Product creation error:', error)
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 })
  }
}
