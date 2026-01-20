import Link from 'next/link'
import React from 'react'
import MenuSheet from "@/components/ui/menu-sheet";
import PlaceSearchBar from './ui/place-search-bar';
import AddressModal from './ui/address-modal';
import { fetchLocation } from '@/lib/restaurants/api';
import Cart from './cart';



const Header = async () => {
  const { lat, lng } = await fetchLocation();
  // ✅fetchLocationはサーバーコンポーネント専用の関数であり、
  // 宣言で実行する必要があるのでサーバーアクションズは使えないので
  // ここで実行する
  return (
    <header className="bg-background h-16 fixed top-0 left-0 w-full z-50">
      <div className="flex items-center h-full space-x-4 px-4 max-w-[1920] mx-auto">
        <MenuSheet />
        <div className="font-bold">
          <Link href="/">Delivery APP</Link>
        </div>
        <AddressModal />

        <div className="flex-1">
          <PlaceSearchBar lat={lat} lng={lng} />
        </div>
        <Cart />
      </div>
    </header>
  )
}

export default Header
