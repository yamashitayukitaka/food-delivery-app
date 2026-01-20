import MenuContent from "@/components/menu-content";
import MenuSearchBar from "@/components/menu-search-bar";
import { Button } from "@/components/ui/button";
import { fetchCategoryMenus } from "@/lib/menus/api";
import { getPlaceDetails } from "@/lib/restaurants/api";
import { Heart } from "lucide-react";
import Image from "next/image";
import { notFound } from "next/navigation";

export default async function RestaurantPage({
  params,
  // ✅動的ルーティングの値をURLから取得できる
  searchParams,
  //クエリパラメーターのキーと値を取得できる
}:
  // ✅このとき Next.js が内部で：
  // URL の 動的ルーティング部分 → params
  // URL の クエリパラメーター → searchParams
  // を 自動で解析してデータを引数に渡す。
  // 引数名は他の名前ではだめ
  {
    params: Promise<{ restaurantId: string }>;
    searchParams: Promise<{ sessionToken?: string; searchMenu?: string }>;
  }) {
  const { restaurantId } = await params;
  const { sessionToken, searchMenu } = await searchParams;
  // ✅searchParams にキーが存在しない場合、その値は undefinedになる
  // undefinedも関数に引数に渡せる
  // sessionTokenが存在しない場合はundefinedが渡される

  console.log("searchMenu", searchMenu);

  console.log("restaurantId", restaurantId);
  console.log("sessionToken", sessionToken);



  const { data: restaurant, error: menusError } = await getPlaceDetails(
    restaurantId,
    ["displayName", "photos", "primaryType"],
    sessionToken
  );



  console.log("レストラン", restaurant);

  const primaryType = restaurant?.primaryType
  console.log('primaryType', primaryType)

  const { data: categoryMenus, error: munusError } = primaryType ? await fetchCategoryMenus(primaryType, searchMenu) : { data: [] };


  if (!restaurant) notFound();
  // ✅ notFound() を明示的に呼ぶと 404 に遷移する
  // ✅ この場合 error.tsx は使われない
  // ✅ not-found.tsx があればそれが表示
  // ✅ なければ Next.js デフォルト 404

  return (
    <>
      <div>
        <div className="h-64 rounded-xl shadow-md relative overflow-hidden">
          <Image
            src={restaurant.photoUrl!}
            fill
            alt={restaurant.displayName ?? "レストラン画像"}
            className="object-cover"
            priority
            sizes="(max-width: 1280px) 100vw, 1200px"
          />
          <Button
            size="icon"
            variant="outline"
            className="absolute top-4 right-4 shadow rounded-full"
          >
            <Heart color="gray" strokeWidth={3} size={15} />
          </Button>
        </div>

        <div className="mt-4 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{restaurant.displayName}</h1>
          </div>

          <div className="flex-1">
            <div className="ml-auto w-80"><MenuSearchBar /></div>
          </div>
        </div>
      </div>
      {!categoryMenus ? (
        <p>{menusError}</p>
      ) : categoryMenus.length > 0 ?
        (<MenuContent
          categoryMenus={categoryMenus}
          restaurantId={restaurantId}
        />) : (<p>メニューが見つかりません</p>)
      }
    </>
  );
}

