'use client'
import Image from "next/image";
import { Menu } from "@/types";

interface MenuCardProps {
  menu: Menu;
  onClick?: (menu: Menu) => void;
}


export default function MenuCard({ menu, onClick }: MenuCardProps) {
  return (
    <div onClick={() => onClick?.(menu)} className="cursor-pointer">

      <div className="relative aspect-square rounded-lg overflow-hidden">
        <Image
          src={menu.photoUrl}
          className="object-cover w-full h-full"
          alt={menu.name}
          fill
          sizes="(max-width: 1280px) 18.75vw, 240px"
        />
      </div>

      <div className="mt-2">
        <p className="font-bold  truncate">{menu.name}</p>
        <p className="text-muted-foreground">
          <span className="text-sm">￥{menu.price}</span>
        </p>
      </div>
    </div>
  )
}