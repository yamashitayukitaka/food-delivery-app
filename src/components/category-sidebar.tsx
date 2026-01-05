'use client'
import { cn } from "@/lib/utils"
// ✅onClickはクライアントコンポーネントでしか使えない

import { categoryMenu } from "@/types"

interface CategorySidebarProps {
  categoryMenus: categoryMenu[]
  onSelectCategory: (categoryId: string) => void
  // ✅引数としてstring型のcategoryIdを受け取る。voidは戻り値が無いことを表す。
  activeCategoryId: string
}

export default function CategorySidebar({ categoryMenus, onSelectCategory, activeCategoryId }: CategorySidebarProps) {
  return (
    <aside className="w-1/4  sticky top-16 h-[calc(100vh-64px)]">
      <p className="p-3 font-bold">メニュー Menu</p>
      <nav>
        <ul>
          {categoryMenus.map((category) => (
            <li key={category.id}>
              <button onClick={() => onSelectCategory(category.id)} className={cn(
                'w-full p-4 text-left border-l-4 transition-colors',
                activeCategoryId === category.id ? 'bg-input font-medium  border-primary' : 'hover:bg-muted border-transparent')} type="button">
                {category.categoryName}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </aside >
  )
}