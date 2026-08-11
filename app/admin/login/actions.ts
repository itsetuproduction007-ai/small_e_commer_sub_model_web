'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

export async function verifyAdminPin(formData: FormData) {
  const pin = formData.get('pin')
  
  const correctPin = process.env.ADMIN_PIN
  
  if (!correctPin) {
    // If no pin is configured in env, allow default 123456 for development fallback
    if (pin !== '123456') {
      return { error: 'Invalid PIN' }
    }
  } else {
    if (pin !== correctPin) {
      return { error: 'Invalid PIN' }
    }
  }
  
  // Set the authentication cookie
  const cookieStore = await cookies()
  cookieStore.set('admin_auth', 'authenticated', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/'
  })
  
  redirect('/admin')
}
