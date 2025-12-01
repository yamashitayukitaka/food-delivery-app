'use client';
// ✅onClickを使用しているので、クライアントコンポーネントにする必要がある

import Image from "next/image";
import { CategoryType } from "./categories";
import { cn } from "@/lib/utils";


interface CategoryProps {
  category: CategoryType;
  onClick: (category: string) => void;
  select: boolean;
}

export default function Category({ category, onClick, select }: CategoryProps) {
  return (
    <div onClick={() => onClick(category.type)} className="cursor-pointer">
      {/* ✅onClick={onClick(category.type)} とすると
    　　即時実行関数になってしまい、クリック時に関数が実行されるのではなく、
    　　コンポーネントがレンダリングされるタイミングで関数が実行されてしまう。
    
        ✅onClick={() => onClick(category.type)} とすると
    　　クリック時に関数が実行されるようになる。
    */}

      <div className={cn("relative aspect-square overflow-hidden rounded-full", select && "bg-green-200")}>
        {/* ✅shade-cn-uiのcnを使えば上記のような書き方ができる。下記コードと上記コードは同意 */}
        {/* <div className={`relative aspect-square overflow-hidden rounded-full ${select && 'bg-green-200'}`}> */}
        <Image
          className="object-cover scale-75"
          src={category.imageUrl}
          alt={category.categoryName}
          fill
          sizes="(max-width:1280px) 10vw, 97px"
        // sizes 属性の意味:
        // (max-width:1280px) 10vw
        // 画面幅が1280px以下の場合、ブラウザに
        // 「この画像は画面幅の約10%で表示される」と伝える
        // （vw指定は相対サイズなのでおおよそ10%の意味）
        //
        // それ以外（画面幅が1280pxより大きい場合）は97pxで読み込む
        // （px指定は固定値で読み込む）
        />
      </div>
      <div className="text-center mt-2">
        <p className="text-xs truncate">{category.categoryName}</p>
        {/* truncate に含まれる text-overflow: ellipsis は、テキストが横に収まりきらないときに
        「…」で省略表示するための CSS。ただし white-space: nowrap と overflow: hidden が同時に作用して初めて機能する。 */}
      </div>
    </div>
  );
} 