'use client'

import { useState } from 'react'
import { OrderStatus } from '@prisma/client'
import { updateOrderStatus } from './actions'

export function OrderStatusClient({ orderId, currentStatus }: { orderId: string, currentStatus: OrderStatus }) {
  const [isUpdating, setIsUpdating] = useState(false)

  const handleStatusChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value as OrderStatus
    if (newStatus === currentStatus) return
    
    setIsUpdating(true)
    await updateOrderStatus(orderId, newStatus)
    setIsUpdating(false)
  }

  const statuses: OrderStatus[] = [
    'PENDING', 'CONFIRMED', 'PACKED', 'SHIPPED', 'DELIVERED', 'CANCELLED'
  ]

  return (
    <div style={{ position: 'relative' }}>
      <select 
        className="form-input" 
        value={currentStatus} 
        onChange={handleStatusChange}
        disabled={isUpdating}
        style={{ 
          cursor: isUpdating ? 'wait' : 'pointer',
          fontWeight: 600,
          opacity: isUpdating ? 0.7 : 1 
        }}
      >
        {statuses.map(s => (
          <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>
        ))}
      </select>
    </div>
  )
}
