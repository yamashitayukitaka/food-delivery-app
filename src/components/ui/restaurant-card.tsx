import { Heart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import Link from "next/link";


export default function RestaurantCard({ id }: { id: string }) {
  return (
    <div className='relative'>
      <Link href={`/restaurants/${id}`} className='inset-0 absolute z-10'></Link>
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          className='object-cover'
          src={'/no_image.png'}
          fill
          alt="restaurant image"
          sizes="(max-width:1280px) 25vw, 280px"
        />
      </div>
      <div className='flex justify-between'>
        <p className='font-bold'>name</p>
        <div className='z-20'>
          <Heart
            color='red'
            strokeWidth={3}
            size={15}
            className='hover:fill-red-500 hover:stroke-0' />
        </div>
      </div>
    </div>
  )
}


