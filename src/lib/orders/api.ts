import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { getPlaceDetails } from "../restaurants/api";
import { Order } from "@/types";



export async function fetchOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const bucket = supabase.storage.from('menus')
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    redirect('/login');
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('id,restaurant_id,user_id,created_at,fee,service,delivery,subtotal_price,total_price,order_items(quantity,id,price,name,image_path)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (ordersError) {
    console.error('注文履歴の取得に失敗しました', ordersError);
    throw new Error('注文履歴の取得に失敗しました');
  }

  const promises = orders.map(async (order): Promise<Order> => {
    // ✅map関数内でawaitを使うときは,map関数にasyncを付ける
    const { data: restaurantData, error } = await getPlaceDetails(order.restaurant_id, ['displayName', 'photos'])

    if (!restaurantData || error) {
      console.error(`レストランデータの取得に失敗しました。${error}`);

    }
    return {
      ...order,
      order_items: order.order_items.map((item) => {
        const { image_path, ...restMenus } = item;
        const publicUrl = bucket.getPublicUrl(image_path).data.publicUrl
        return {
          ...restMenus,
          photoUrl: publicUrl,
        };
      }),
      restaurantName: restaurantData?.displayName ?? '不明なお店',
      photoUrl: restaurantData?.photoUrl ?? '/no_image.png',
    };
    // ✅アロー関数で {} を使うと「関数ブロック」として解釈されるため、
    // オブジェクト✅返したい場合は return を使うか、() で包む必要が✅る
  });

  const results = await Promise.all(promises)
  return results;
}