// カスタムフックスは複雑に構築されたフックスの集まりを外部ファイル化して他ファイルで呼び出せるようにしたもの

// 外部化のメリット：
// 複数コンポーネントで useCart() を呼ぶだけで同じロジックを使える



import { Cart } from "@/types";
import useSWR from "swr";

const fetcher = async (url: string) => {
  //✅urlには/api/addressが入る
  //✅fetcher関数はuseSWR(/api/cart, fetcher)が実行合図となる

  console.log('カート全件取得');
  const response = await fetch(url);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error);
    // ✅throw new Errorを使うことで、useSWRのerrorにエラー内容が渡される
    // デフォルトではルートハンドラーズからsupabase経由でのエラー内容はdata内に入るので
    // useSWRのerrorで受け取れないのでthrow new Errorでエラー内容をuseSWRのerrorに渡した
  }
  const data = await response.json();
  return data;
  // ✅成功時はdataが返されuseSWRのdataに渡される 
}

export function useCart(restaurantId?: string, enabled = true) {
  const { data: carts, error: cartsError, isLoading, mutate: mutateCart } = useSWR<Cart[]>(`/api/cart`, fetcher, { isPaused: () => !enabled });
  // ✅useSWRは<>内に型定義し、その型はfetcher関数の返り値に適応する

  const targetCart = restaurantId ? carts?.find((cart) => cart.restaurant_id === restaurantId) ?? null : null;

  return { carts, cartsError, isLoading, mutateCart, targetCart };
}

