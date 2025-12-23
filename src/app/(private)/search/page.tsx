import { fetchCategoryRestaurants, fetchLocation, fetchRestaurantsByKeyword } from "@/lib/restaurants/api";
import RestaurantList from "@/components/ui/restaurant-list";
import Categories from "@/components/ui/categories";
import { redirect } from "next/navigation";




export default async function SearchPage({
  searchParams,
  // 分割代入の対象がひとつであっても
  // “通常は末尾に,を付ける”
}: {
  searchParams: Promise<{ category?: string, restaurant?: string }>;
  // ✅Next15ではsearchParamsは非同期で提供されるので型定義にPromiseを定義する
  // ✅categoryかrestaurantのどちらかしか取得できないので
  // Tsの型定義にオプショナルプロパティを付ける
}) {


  const { category, restaurant } = await searchParams
  console.log(restaurant)
  const { lat, lng } = await fetchLocation();

  if (category) {

    const { data: categoryRestaurants, error: fetchError } = await fetchCategoryRestaurants(category, lat, lng);
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
  } else if (restaurant) {
    const { data: restaurants, error: fetchError } = await fetchRestaurantsByKeyword(restaurant, lat, lng);
    console.log('text_search_results', restaurants)

    return (
      <>
        <div className="mb-4">
          <Categories />
        </div>
        {!restaurants ? (
          <p className="text-destructive">{fetchError}</p>
        ) : restaurants.length > 0 ? (
          <>
            <div className="mb-4">
              {restaurant}の検索結果は{restaurants?.length}件です
            </div>
            <RestaurantList restaurants={restaurants} />
          </>
        ) : (
          <p>
            <strong>{restaurant}</strong>に一致するレストランが見つかりません
          </p>
        )}
      </>
    );
  } else {
    redirect(('/'))
    // urlのクエリパラメータを削除した場合はホームへリダイレクトさせる
  }
}