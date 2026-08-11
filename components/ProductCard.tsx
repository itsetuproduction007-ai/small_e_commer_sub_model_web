import Image from 'next/image'
import Link from 'next/link'
import Button from './Button'

interface ProductCardProps {
  id: string | number
  title: string
  price: string
  imageSrc: string
  href: string
}

export default function ProductCard({ title, price, imageSrc, href }: ProductCardProps) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-sm border border-gray-100 flex flex-col h-full hover:shadow-md transition-shadow duration-300">
      {/* Aspect Ratio 3:4 Image Container */}
      <div className="relative w-full aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 mb-4">
        <Image 
          src={imageSrc} 
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>
      
      <div className="flex flex-col flex-1">
        <h3 className="font-sans font-semibold text-gray-900 text-sm md:text-base leading-snug line-clamp-2 mb-1">
          {title}
        </h3>
        <p className="font-sans font-bold text-brand text-base md:text-lg mb-4 mt-auto">
          {price}
        </p>
        
        <Link href={href} className="w-full mt-auto">
          <Button fullWidth size="sm" variant="primary">
            Buy Now
          </Button>
        </Link>
      </div>
    </div>
  )
}
