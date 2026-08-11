/**
 * Generates a product code like RER-SAR-001
 * @param category 3-letter category code e.g. SAR, KUR, SLW
 * @param sequence numeric sequence
 */
export function generateProductCode(category: string, sequence: number): string {
  const seq = String(sequence).padStart(3, '0')
  return `RER-${category.toUpperCase()}-${seq}`
}

/**
 * Generates an order code like RER-ORD-1025
 */
export function generateOrderCode(sequence: number): string {
  return `RER-ORD-${sequence}`
}

/**
 * Generates a customer code like CUS-0042
 */
export function generateCustomerCode(sequence: number): string {
  const seq = String(sequence).padStart(4, '0')
  return `CUS-${seq}`
}

/**
 * Extracts product codes from Instagram caption text
 * Matches patterns like RER-SAR-001, RER-KUR-012, etc.
 */
export function extractProductCodesFromCaption(caption: string): string[] {
  const regex = /RER-[A-Z]{2,4}-\d{3}/gi
  const matches = caption.match(regex)
  return matches ? [...new Set(matches.map(m => m.toUpperCase()))] : []
}

/**
 * Generates a WhatsApp click-to-chat URL with a pre-filled message
 */
export function generateWhatsAppUrl(phone: string, message: string): string {
  const encoded = encodeURIComponent(message)
  return `https://wa.me/${phone}?text=${encoded}`
}

/**
 * Generates a new order notification message for staff
 */
export function generateStaffOrderMessage(
  orderCode: string,
  productNames: string[],
  customerName: string,
  staffUrl: string
): string {
  return `🛍️ *New Order — ${orderCode}*\n\nCustomer: ${customerName}\nProducts: ${productNames.join(', ')}\n\nTap to process:\n${staffUrl}`
}

/**
 * Generates a customer order confirmation message
 */
export function generateCustomerConfirmationMessage(
  orderCode: string,
  customerName: string,
  trackingUrl: string
): string {
  return `✅ *Order Confirmed — ${orderCode}*\n\nHi ${customerName}! Your order from Rang E Renju has been received.\n\nTrack your order:\n${trackingUrl}`
}

/**
 * Format price in INR
 */
export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Format date in Indian style
 */
export function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Kolkata',
  }).format(date)
}
