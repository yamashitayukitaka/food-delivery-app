import { fetchCategoryRestaurants } from "@/lib/restaurants/api";
import RestaurantList from "@/components/ui/restaurant-list";
import Categories from "@/components/ui/categories";



export default async function SearchPage({
  searchParams,
  // 分割代入の対象がひとつであっても
  // “通常は末尾に,を付ける”
}: {
  searchParams: Promise<{ category: string }>;
  // ✅Next15ではsearchParamsは非同期で提供されるので型定義にPromiseを定義する
}) {


  const { category } = await searchParams

  if (category) {
    const { data: categoryRestaurants, error: fetchError } = await fetchCategoryRestaurants(category);
    // 受けとったオブジェクト（キーがdata値がcategoryRestaurantsの内容）を分割代入として受け取り キー名をcategoryRestaurantsに変更している
    // 受けとったオブジェクト（キーがerror値が `NearbySearchリクエスト失敗:${response.status}`）を分割代入として受け取り キー名をfetchErrorに変更している
    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>
        {!categoryRestaurants ? (
          <p className="text-destructive">{fetchError}</p>
        ) : categoryRestaurants.length > 0 ? (
          <RestaurantList restaurants={categoryRestaurants} />
        ) : (
          <p>
            カテゴリ<strong>{category}</strong>
            に一致するレストランが見つかりません
            ✅
          </p>
        )}
      </>
    );
  }
}