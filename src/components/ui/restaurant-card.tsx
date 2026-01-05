import { Heart } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { Restaurant } from "@/types";
import Link from 'next/link';

// ------------------------------------------------------
interface RestaurantCardProps {
  restaurant: Restaurant;

}
// 受け取る props の形
// {
//   restaurant: {
//     id: string,
//     restaurantName?: string,
//     primaryType?: string,
//     photoUrl: any,
//   }
// }
// 

// ✅
// このようにprops名はキーとして値と一緒に渡されるので 
// restaurantのようにキー名も定義する必要がある
// 外側の{}はProps自体がオブジェクトであるから
// ------------------------------------------------------

export default async function RestaurantCard({ restaurant }: RestaurantCardProps) {
  // ✅RestaurantCardPropsの型定義はprops全体の型定義しているわけであって
  // 分割代入の｛restaurant｝自体の型定義をしているわけではない
  // 型定義に関しては分割代入の｛restaurant｝は関係ない


  return (
    <div className='relative'>
      <Link href={`/restaurant/${restaurant.id}`} className='inset-0 absolute z-10'></Link>
      <div className="relative aspect-video rounded-lg overflow-hidden">
        <Image
          className='object-cover'
          src={restaurant?.photoUrl}
          fill
          alt="restaurant image"
          sizes="(max-width:1280px) 25vw, 280px"
        />
      </div>
      <div className='flex justify-between'>
        <p className='font-bold'>{restaurant?.restaurantName}</p>
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


