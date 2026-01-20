'use server'
import { getPlaceDetails } from "@/lib/restaurants/api";
// Client Component から Supabase にアクセスする場合は
// セキュリティ上、Server Action や Route Handler を経由する必要がある。

// Server Component ではサーバー実行のため
// 通常の async 関数として直接 Supabase を呼び出せる。

// 今回はClient Component から Supabase にアクセスするのでサーバーアクションを使用する

import { Cart, Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

type addToCartActionResponse = { type: 'new', cart: Cart } | { type: 'update', id: number };

export async function addToCartAction(selectedItem: Menu, quantity: number, restaurantId: string): Promise<addToCartActionResponse> {
  const supabase = await createClient();
  const bucket = supabase.storage.from('menus');
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }


  const { data: existingCart, error: existingCartError } = await supabase
    .from('carts')
    .select('id')
    .match({ user_id: user.id, restaurant_id: restaurantId })
    // ✅2つの条件を同時に満たす行のみどちらかだけ満たしてもだめ
    .maybeSingle();

  if (existingCartError) {
    console.error("カートの取得に失敗しました。", existingCartError);
    throw new Error("カートの取得に失敗しました。");
  }

  if (!existingCart) {
    const { data: newCart, error: newCartError } = await supabase
      .from('carts')
      .insert({
        user_id: user.id,
        restaurant_id: restaurantId,
      }).select('id').single()
    if (newCartError) {
      console.error("カートの作成に失敗しました。", newCartError);
      throw new Error("カートの作成に失敗しました。");
    }
    const newCartId = newCart.id
    const { error: insertError } = await supabase
      .from('cart_items')
      .insert(
        {
          quantity: quantity,
          cart_id: newCartId,
          menu_id: selectedItem.id
        }
      )
    if (insertError) {
      console.error("カートの追加に失敗しました。", insertError);
      throw new Error("カートの追加に失敗しました。");
    }
    const { data: insertedCart, error: insertedcartError } = await supabase
      .from('carts')
      .select('cart_items(quantity,id,menus(id,name,price,image_path)),restaurant_id,id')
      .match({ user_id: user.id, id: newCartId }).single();
    if (insertedcartError) {
      console.error("カートデータの取得に失敗しました。", insertedcartError);
      throw new Error(`カートデータの取得に失敗しました。${insertedcartError}`);
    }

    const { data: restaurantData, error } = await getPlaceDetails(restaurantId, ['displayName', 'photos'])

    if (!restaurantData || error) {
      throw new Error(`レストランデータの取得に失敗しました。${error}`)
    }
    const updatedCart: Cart = {
      ...insertedCart,
      cart_items: insertedCart.cart_items.map((item) => {
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
    return { type: 'new', cart: updatedCart };
    // ---------------------------------------------
    //existingCart が存在しない場合は return によって
    // 確実に処理が終了するため、
    // const { error: upsertError } = await supabase.from('cart_items').upsert(...)
    // が実行される時点では、
    // 必ず existingCart が存在する場合のみが保証されている。

    // 一方、return を付けない場合は、
    // existingCart が存在しないケースでも
    //　upsert が実行されてしまう。
    // ---------------------------------------------

    // ---------------------------------------------
    // ★✅return は if ブロックの中で実行されても、
    // その if ブロックだけでなく、
    // 関数全体の実行を即座に終了させる。

    // 仮にreturn が何かを返す場合であっても
    // 返す値が何であっても、
    // 関数の処理は即座に終了する。
    // return error; 
    // return null;
    // return { success: false }
    // であっても関数の処理は即座に終了する。
    // ---------------------------------------------
  }

  const { data, error: upsertError } = await supabase.from('cart_items').upsert({
    quantity: quantity,
    cart_id: existingCart.id,
    menu_id: selectedItem.id
  }, {
    onConflict: 'menu_id,cart_id'
    // cartId: existingCart.id,
    // menu_id: selectedItem.id
    // 上記の2つのペアが同時に存在する行が無い場合はINSERTし、ある場合はUPDATEする

  }).select('id').single();
  if (upsertError) {
    console.error("カートアイテムの追加、更新に失敗しました。", upsertError);
    throw new Error("カートアイテムの追加、更新に失敗しました。");
  }
  return { type: 'update', id: data.id }
}

export async function updateCartItemAction(quantity: number, cartItemId: number, cartId: number) {
  const supabase = await createClient();
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }
  //削除処理
  if (quantity === 0) {
    const { count, error } = await supabase
      .from("cart_items")
      .select("*", { count: "exact", head: true })
      .eq("cart_id", cartId);

    if (error) {
      console.error("カートの取得に失敗しました。", error);
      throw new Error("カートの取得に失敗しました。");
    }
    if (count === 1) {
      const { error: deleteCartError } = await supabase
        .from("carts")
        .delete()
        .match({ user_id: user.id, id: cartId });

      if (deleteCartError) {
        console.error("カートの削除に失敗しました。", deleteCartError);
        throw new Error("カートの削除に失敗しました。");
      }
      return;
    }
    const { error: deleteCartrror } = await supabase
      .from("cart_items")
      .delete()
      .eq("id", cartItemId);
    if (deleteCartrror) {
      console.error("カートアイテムの削除に失敗しました。", deleteCartrror);
      throw new Error("カートアイテムの削除に失敗しました。");
    }
    return;
  }
  const { error: updateError } = await supabase.from('cart_items').update({
    quantity: quantity
  }).match({ id: cartItemId });
  if (updateError) {
    console.error("カートアイテムの更新に失敗しました。", updateError);
    throw new Error("カートアイテムの更新に失敗しました。");
  }
}