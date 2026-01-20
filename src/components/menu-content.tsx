'use client'
// ✅イベントハンドラ（関数）をpropsとして子コンポーネントに渡しているため
// このコンポーネントもClient Componentである必要がある
// Server Component では、イベントハンドラを
// JSX の props として渡すことはできない

// ★イベントリスナーで呼び出される関数をイベントハンドラーという

import CategorySidebar from "./category-sidebar";
import { categoryMenu } from "@/types";
import Section from "./ui/section";
import CarouselContainer from "./ui/carousel-container";
import MenuCard from "./menu-card";
import FlatMenuCard from "./flat-menu-card";
import { useState } from "react";
import { InView } from "react-intersection-observer";
import MenuModal from "./menu-modal";
import { useModal } from "@/app/context/modalContext";
import { useCartVisibility } from "@/app/context/cartContext";
import { useCart } from "@/hooks/cart/useCart";


interface MenuContentProps {
  categoryMenus: categoryMenu[];
  restaurantId: string
}

export default function MenuContent({ categoryMenus, restaurantId }: MenuContentProps) {
  const { isOpen, openModal, closeModal, selectedItem } = useModal()
  const { targetCart, mutateCart } = useCart(restaurantId, false);
  const [activeCategoryId, setActiveCategoryId] = useState(categoryMenus[0].id)
  // ✅reactの設計概念として通常、stateは親コンポーネントで管理して 子コンポネントにpropsで渡す
  // React は Top-down（上から下） のデータフローを前提にしています。
  const { openCart } = useCartVisibility();

  const handleSelectCategory = (categoryId: string) => {
    console.log(categoryId)
    const element = document.getElementById(`${categoryId}-menu`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
      // scrollIntoView は DOM Element に標準で定義されているメソッド
      setActiveCategoryId(categoryId)
    }
  }

  return (
    <div className="flex  gap-4 ">
      <CategorySidebar
        categoryMenus={categoryMenus}
        onSelectCategory={handleSelectCategory}
        activeCategoryId={activeCategoryId}
      />
      <div className="w-3/4">
        {categoryMenus.map((category) => (
          <InView
            className="scroll-mt-16"
            id={`${category.id}-menu`}
            key={category.id}
            as="div"
            threshold={0.7}
            onChange={(inView, entry) => inView && setActiveCategoryId(category.id)
            }
          >

            {/* ✅id や className は「文字列として扱われる必要がある */}
            {/* scroll-mt-16は要素にスクロールで飛んできたとき、上に 4rem 分の余白を確保するための指定 */}
            {/* 通常レイアウトには影響せず、スクロールの“到達位置”にだけ余白が効く */}
            <Section title={category.categoryName}>
              {category.id === 'featured' ? (
                <CarouselContainer slideToShow={4}>
                  {category.items.map((menu) => (
                    <MenuCard
                      menu={menu}
                      onClick={openModal}
                    // ?なぜuseContextを使ってるのにわざわざPropsの受け渡しをするのか
                    />
                  ))}
                </CarouselContainer>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  {category.items.map((menu) => (
                    <FlatMenuCard
                      menu={menu}
                      key={menu.id}
                      // ✅keyはpropsではなくコンポネント自体に渡している
                      onClick={openModal}
                    />
                  ))}
                </div>
              )
              }
            </Section>
          </InView>
        ))}
      </div>
      <MenuModal
        isOpen={isOpen}
        closeModal={closeModal}
        selectedItem={selectedItem}
        restaurantId={restaurantId}
        openCart={openCart}
        targetCart={targetCart}
        mutateCart={mutateCart}
      />
    </div>
  );
}
