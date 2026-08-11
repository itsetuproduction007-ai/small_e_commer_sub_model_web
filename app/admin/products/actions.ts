'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateProductQuick(productId: string, data: { stock?: number, price?: number, isPublished?: boolean }) {
  try {
    await prisma.product.update({
      where: { id: productId },
      data
    })
    
    revalidatePath('/admin/products')
    revalidatePath('/shop')
    return { success: true }
  } catch (error) {
    console.error('Failed to update product', error)
    return { error: 'Failed to update product' }
  }
}
