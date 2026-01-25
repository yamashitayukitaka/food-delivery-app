import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"


interface CarouselContainerProps {
  children: React.ReactNode[];
  //   今回の場合
  //   [
  // 　　<RestaurantCard key={0} />, 
  //     <RestaurantCard key={0} />,
  //     <RestaurantCard key={1} />,
  //     <RestaurantCard key={2} />,
  //     <RestaurantCard key={3} />,
  //     <RestaurantCard key={4} />,
  //    ]
  //    がPropsとしてCarouselContainerに渡されるいるのでchildrenはReact.ReactNodeの配列型とするするために[]をつける

  slideToShow: number;
}

export default function CarouselContainer({ children, slideToShow }: CarouselContainerProps) {
  return (
    <Carousel
      opts={{
        align: "start",
      }}
      className="w-full"
    >
      <CarouselContent>
        {children.map((child, index) => (
          <CarouselItem key={index}
            style={{ flexBasis: `${100 / slideToShow}%` }}
          >
            {/* 
            ✅basis-1/3" は「親要素の幅の1/3の幅を持つ」という意味
            一度に表示される枚数を指定する
            ※静的に指定する場合はclassName = 'basis-1/3'のように指定すれば良い
             

            ✅className={`basis-${1 / slideToShow}`}
            のような「動的な値を使った Tailwind クラス名」は、
            Tailwind のコンパイル時（ビルド時）に展開されないため使えません。
            Tailwind は静的解析を行うため、basis-1/3 のように固定値でないと反映されない


            ✅そのため今回は style 属性を使ってインラインスタイルで flexBasis を指定しています
            style={{ flexBasis: `${100 / slideToShow}%` }}

            
            tailwidCSS ---->css
            basis-1/2  → flex-basis: 50%
            basis-1/3  → flex-basis: 33.3333%
            basis-1/4  → flex-basis: 25%

            */}
            <div className="p-1">
              {child}
            </div>
          </CarouselItem>
        ))}
        {/* {children} */}
        {/* ✅{children} が
        [ 
         　<RestaurantCard key={0} />, 
        　 <RestaurantCard key={0} />, 
           <RestaurantCard key={1} />,
           <RestaurantCard key={2} />,
           <RestaurantCard key={3} />,
           <RestaurantCard key={4} />,
         ] 
         なので {children}だけでも描画可能だが 
         それだけでは <RestaurantCard>各要素にスタイルを当てられないので mapで展開する必要があった 

         ✅「CarouselContainerで展開するのは、Homeでスタイルを付与していない<RestaurantCard>に対して、スライドレイアウト用のCSSを当てるため」
        「Homeであらかじめスタイルを<RestaurantCard>に付与していたら、わざわざ展開する必要はない」

　　　　　★しかしCarouselContainerはレイアウト担当コンポーネントなのでHomeコンポネントではなくCarouselContainerで展開するのが適切と判断 */}

      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}

