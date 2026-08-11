'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { OrderStatus } from '@prisma/client'

export async function updateOrderStatus(orderId: string, newStatus: OrderStatus) {
  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { status: newStatus }
    })
    
    // Also record the history
    await prisma.orderStatusHistory.create({
      data: {
        orderId,
        status: newStatus,
        note: `Status updated by Admin`
      }
    })

    revalidatePath('/admin/orders')
    revalidatePath('/admin')
    return { success: true }
  } catch (error) {
    console.error('Failed to update order status', error)
    return { error: 'Failed to update status' }
  }
}
