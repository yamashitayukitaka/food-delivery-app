'use client';
import CarouselContainer from "./carousel-container";
import Category from "./category";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export interface CategoryType {
  categoryName: string;
  type: string;
  imageUrl: string;
}

export default function Categories() {


  const categories: CategoryType[] = [
    {
      categoryName: "ファーストフード",
      type: "fast_food_restaurant",
      imageUrl: "/images/categories/ファーストフード.png",
      // ✅Nextjsではpublicフォルダがルート直下にある場合、パスにpublic/を明示する必要はない
    },
    {
      categoryName: "日本料理",
      type: "japanese_restaurant",
      imageUrl: "/images/categories/日本料理.png",
    },
    {
      categoryName: "ラーメン",
      type: "ramen_restaurant",
      imageUrl: "/images/categories/ラーメン.png",
    },
    {
      categoryName: "寿司",
      type: "sushi_restaurant",
      imageUrl: "/images/categories/寿司.png",
    },
    {
      categoryName: "中華料理",
      type: "chinese_restaurant",

      imageUrl: "/images/categories/中華料理.png",
    },
    {
      categoryName: "コーヒ-",
      type: "cafe",
      imageUrl: "/images/categories/コーヒー.png",
    },
    {
      categoryName: "イタリアン",
      type: "italian_restaurant",
      imageUrl: "/images/categories/イタリアン.png",
    },
    {
      categoryName: "フランス料理",
      type: "french_restaurant",
      imageUrl: "/images/categories/フレンチ.png",
    },

    {
      categoryName: "ピザ",
      type: "pizza_restaurant",
      imageUrl: "/images/categories/ピザ.png",
    },

    {
      categoryName: "韓国料理",
      type: "korean_restaurant",
      imageUrl: "/images/categories/韓国料理.png",
    },
    {
      categoryName: "インド料理",
      type: "indian_restaurant",
      imageUrl: "/images/categories/インド料理.png",
    },

  ]

  const searchParams = useSearchParams();
  const router = useRouter();


  const currentCategory = searchParams.get("category")
  // ✅searchParams.get('category') の挙動

  // クエリパラメータ付きURLの場合のみ値を取得できる
  // 例: /search?category=ramen_restaurant
  // この場合 searchParams.get('category') は "ramen_restaurant" を返す。

  // フロントページなどクエリパラメータがないURLでは null を返す
  // 例: /（クエリパラメータなし）
  // この場合 searchParams.get('category') は null になる。

  // ✅Categoriesコンポネントをフロントページで出力する場合は、nullを取得
  // ✅Categoriesコンポネントをseach/page.tsxで出力する場合は、URLのクエリパラメータの値が取得できる


  const searchRestaurantsOfCategory = (category: string) => {
    const params = new URLSearchParams(searchParams);
    //✅SearchParamsクラスをインスタンス化（初期化）して利用可能に
    // つまり new URLSearchParamsで 値を追加・更新・削除できる「利用可能な状態」に組み立てた というイメージ


    if (currentCategory === category) {
      router.replace('/')
    } else {
      params.set("category", category);
      // ✅params.set("category", category)でURLの末尾部分の表記がcategory=ramen_restaurantのように表記される
      router.replace(`/search?${params.toString()}`);
      // ✅toString()で文字列に変換しないとcategory=ramen_restaurantのように認識できない場合がある
      // ✅toString()で文字列化しないと [object URLSearchParams] になり、URLクエリとして正しく認識されない

      // ✅replaceを使うとpushと違い、ブラウザの戻るボタンで戻れなくなる
      // replaceとpushは指定先にページ遷移する点では同じ
    }
  }

  // ★ router.replace() でクエリ付きURLに遷移すると、
  // 遷移先の App Router の page.tsx では
  // Next.js がURL クエリ（?category=xxxx）をそのまま searchParamsをPropsとして
  // 遷移先のコンポーネントに渡すことができる

  // ★クエリパラメータ（?key=value）を使ったURLを使用している場合遷移先で
  // データを受け取る場合、props名はsearchParamsになる
  // useSearchParams()を使ってURLを形成していることとは一切関係ない


  return (
    <CarouselContainer slideToShow={10}>
      {
        categories.map((category) => (
          <Category
            category={category}
            key={category.type}
            onClick={searchRestaurantsOfCategory}
            select={currentCategory === category.type}
          // currentCategoryとcategory.typeが同じ場合はtrueが成立し、
          // 異なる場合はfalseが成立するので
          // select={currentCategory === category ? true : false}と書く必要は無い
          />
        ))
      }
    </CarouselContainer>
  );
}