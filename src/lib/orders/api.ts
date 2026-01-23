import { createClient } from "@/utils/supabase/server";

export async function fetchOrders() {
  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: 'ユーザーが認証されていません' };
  }

  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('*')
    .eq('user_id', user.id);

  if (ordersError) {
    return { error: '注文データの取得に失敗しました' };
  }

  return { orders };
}