import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import Button from '@/components/Button'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rang E Renju — Handpicked Indian Textiles & Sarees',
  description: 'Discover our curated collection of Sungudi, cotton, and zari weaves. Shop sarees and ethnic wear with easy UPI payment. Fast shipping across India.',
}

export default function HomePage() {
  const steps = [
    { num: 1, icon: '📸', desc: 'Currently, managing Instagram DM sales involves typing codes, sharing UPI, checking stock, and answering availability.' },
    { num: 2, icon: '🤖', desc: 'An automated web store that connects with your Instagram, making instant sales while retaining your personal touch.' },
    { num: 3, icon: '🔍', desc: 'An automated web store that connects with your Instagram, enabling manual tracking while replacing chaotic DMs.' },
    { num: 4, icon: '🛍️', desc: 'An automated web store that connects with your Instagram post. Customers just enter the code.' },
    { num: 5, icon: '✅', desc: 'Automated web store reduces manual workload while making tracking easier.' },
  ]

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-background pb-24">
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-gray-900 tracking-tight mb-8">
            Colours That Tell Stories
          </h1>
          
          <Button variant="primary" size="lg" className="mb-8">
            Shop the Collection
          </Button>
          
          <p className="max-w-2xl mx-auto text-lg text-gray-700 font-sans leading-relaxed">
            Welcome, Rang E Renju Team! We're excited to show you the new custom e-commerce platform we've built, focusing on speed, usability, and beautiful design.
          </p>
        </section>

        {/* How It Works Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
          <div className="mb-10 flex flex-col md:flex-row items-center gap-4">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-gray-900 flex items-center gap-3">
              <span className="text-brand">→</span> The Current Journey
            </h2>
            <div className="hidden md:block h-px flex-1 bg-gray-200 ml-4"></div>
          </div>
          
          <h3 className="text-xl font-bold font-sans text-gray-900 mb-6">
            How It Works:
          </h3>

          {/* Horizontally scrolling container on mobile, grid on desktop */}
          <div className="flex overflow-x-auto pb-8 -mx-4 px-4 snap-x snap-mandatory md:grid md:grid-cols-5 md:overflow-visible md:pb-0 md:mx-0 md:px-0 gap-6 hide-scrollbar">
            {steps.map((step) => (
              <div 
                key={step.num}
                className="flex-none w-72 md:w-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center text-center snap-center hover:shadow-md transition-shadow duration-300"
              >
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center text-xl mb-4 text-brand">
                  {step.icon}
                </div>
                <h4 className="text-brand font-bold font-serif mb-3 tracking-wide">
                  Step {step.num}
                </h4>
                <p className="text-sm text-gray-600 font-sans leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
