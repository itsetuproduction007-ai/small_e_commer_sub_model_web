import Navbar from '@/components/Navbar'

export default async function TrackIndexPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const resolvedParams = await searchParams
  const error = resolvedParams?.error

  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_PHONE || '919876543210'

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">

          {/* Shipping Icon */}
          <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
            📦
          </div>

          <h1 className="text-3xl font-serif font-bold text-gray-900 mb-3">
            Track Your Order
          </h1>
          <p className="text-gray-500 font-sans text-sm mb-8 leading-relaxed">
            Enter your order number to use the tracking link and join WhatsApp to get live updates on your order.
          </p>

          {/* Error Banner */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl px-4 py-3 text-sm mb-6">
              {error === 'not_found' ? 'Order not found. Please check your order number.' : 'Invalid tracking request.'}
            </div>
          )}

          {/* Track Form */}
          <form method="get" action="/track/search" className="flex gap-0 mb-8">
            <input
              type="text"
              name="order"
              id="track-order-input"
              placeholder="Enter order number"
              aria-label="Order number"
              className="flex-1 border border-gray-200 rounded-l-xl px-4 py-3 text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-brand focus:border-brand border-r-0 bg-gray-50"
            />
            <button
              type="submit"
              id="track-search-btn"
              className="bg-brand text-white px-6 py-3 rounded-r-xl text-sm font-semibold hover:bg-[#600018] transition-colors whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-brand"
            >
              Track
            </button>
          </form>

          {/* WhatsApp Help Link */}
          <p className="text-sm text-gray-400">
            other on the making stop to you?{' '}
            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 font-medium inline-flex items-center gap-1 hover:underline"
            >
              <span>💬</span> Contact us on WhatsApp
            </a>
          </p>
        </div>
      </main>
    </>
  )
}
