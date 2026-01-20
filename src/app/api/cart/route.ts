import { getPlaceDetails } from '@/lib/restaurants/api';
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from "next/server";
import { Cart } from "@/types";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    const bucket = supabase.storage.from('menus')
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { message: 'ユーザーが認証されていません' },
        { status: 401 }
        // ✅「ユーザーが認証されていない」場合は401ステータスコードを指定するのが標準
      )
    }
    const { data: carts, error: cartError } = await supabase
      .from('carts')
      .select('cart_items(quantity,id,menus(id,name,price,image_path)),restaurant_id,id')
      .eq('user_id', user.id)
      .order('id', { referencedTable: 'cart_items', ascending: false })
    // ✅fromに指定したcarts以外のテーブルの値を取得する場合は 外部キーでいずれかの値同志がつながっていればよい

    //✅今回の場合はまず起点になる ログイン中のユーザーのcartsを取得する必要がある 
    // それに外部キーで紐づいている cart_itemsの値を取得。
    // さらにcart_itemsにひも図いているmenusの値を取得する menusはcartsとは外部キーで紐づいてないので、
    // cart_itemsのインデント内に記述する

    //✅正しくリレーションされていれば紐づける外部キーの値は何でも良い

    console.log('cartsです', carts)


    if (cartError) {
      console.error('カートデータを取得できませんでした。', cartError);
      return NextResponse.json(
        { error: 'カートデータを取得できませんでした。' },
        { status: 500 }
      )
    }

    const promises = carts.map(async (cart): Promise<Cart> => {
      // ✅map関数内でawaitを使うときは,map関数にasyncを付ける
      const { data: restaurantData, error } = await getPlaceDetails(cart.restaurant_id, ['displayName', 'photos'])

      if (!restaurantData || error) {
        throw new Error(`レストランデータの取得に失敗しました。${error}`)

      }
      return {
        ...cart,
        cart_items: cart.cart_items.map((item) => {
          const { image_path, ...restMenus } = item.menus;
          const publicUrl = bucket.getPublicUrl(item.menus.image_path).data.publicUrl
          return {
            ...item,
            menus: {
              ...restMenus,
              photoUrl: publicUrl,
            },
          };
        }),
        restaurantName: restaurantData.displayName,
        photoUrl: restaurantData.photoUrl!,
      };
      // ✅アロー関数で {} を使うと「関数ブロック」として解釈されるため、
      // オブジェクト✅返したい場合は return を使うか、() で包む必要が✅る
    });

    const results = await Promise.all(promises)
    // ✅map関数内の非同期処理が終わるまで後続の処理を待たせるためにはPromise.allを使わないといけない
    // ✅ようするにmapは特殊でmap内の非同期関数は 未解決の状態で配列で返ってくるので Promise.all でもう一度処理をかけて返ってきた配列を解決させる必要がある
    // 普通はasync awaitで一発でPromiseは解決する mapが特殊だからPromise　allで再度処理して解決させる
    // map 自体は非同期処理を待たないので、結果は未解決の Promise の配列
    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 }
    )
  }
}
