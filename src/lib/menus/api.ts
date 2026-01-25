import Category from "@/components/category";
import { categoryMenu, Menu } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export async function fetchCategoryMenus(primaryType: string, searchQuery?: string) {
  const supabase = await createClient();
  const bucket = supabase.storage.from('menus')
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }


  let query = supabase
    .from('menus')
    .select('*')
    // ✅ 条件に一致した行の全カラムを取得する
    .eq('genre', primaryType)

  if (searchQuery) {
    query = query.ilike('name', `%${searchQuery}%`)
    // ✅ name カラムの値が searchQuery を部分一致で含み、
    // genre が primaryType に一致する行をすべて取得する。
  }
  // ✅searchQueryが存在しない場合はifブロックを通らないのでelse文を書く必要は無い
  // ✅else を書かなくて済む構造にできるなら、そのほうが良い
  // ✅書かないと処理が成立しない場合以外は、まず else を使わない方向で考える

  const { data: menus, error: menusError } = await query


  if (menusError) {
    //✅ RLS違反、権限不足、存在しないカラム指定、DB接続エラー
    // 「列（カラム）」とは テーブルの縦のタイトル・フィールド名 のこと。値は含まない
    console.log('メニューの取得に失敗しました', menusError)
    return { error: 'メニューの取得に失敗しました' }
  }
  console.log('menus', menus);
  if (menus.length === 0) {
    // ✅.eq('genre', primaryType)と指定しているので 
    // primaryTypeと一致するgenreに存在しない場合 取得する行が無いので menusの数が0になる
    // このif文を書かなくても空配列は返る。エラーになるわけでもない。
    return { data: [] }
  }

  // ----------------------------------------------------------------
  // menus.filter((menu) => menu.is_featured === true)
  // const featuredItems = menus.filter((menu) => menu.is_featured)
  // ✅ filter のコールバックは「条件式の返り値が truthy か falsy か」で判定される。
  //    そのため、boolean 型の menu.is_featured なら menu.is_featured === true と書かなくても同じ結果になる。
  // ❌ 条件式でない場面（例えば単なる代入や関数呼び出しの中など）では、
  //    menu.is_featured と書いても自動で truthy/falsy 判定されるわけではない。
  // ----------------------------------------------------------------

  const categoryMenus: categoryMenu[] = []
  // ✅後からpushを使う為に宣言

  if (!searchQuery) {
    const featuredItems = menus
      .filter((menu) => menu.is_featured)
      .map((menu): Menu => ({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
      }));


    categoryMenus.push(
      {
        id: 'featured',
        categoryName: '注目商品',
        items: featuredItems,
      }
    )
  }


  const categories = Array.from(new Set(menus.map((menu) => menu.category)))
  // ✅Array.from(new Set())で配列の同じ値が複数ある場合は、ひとつにする

  // -------------------------------------------------------------
  // for (const category of categories) {
  //   const same = menus.filter((menu) => menu.category === category)
  //   console.log('same', same)
  // }
  // ✅上記のconsole表示は[{}, {}][{}, {}, {}]


  // const categories = Array.from(new Set(menus.map(menu => menu.category)))
  // const list = categories.map(category => {
  //   const same = menus.filter(menu => menu.category === category)
  //   return same
  // })
  // console.log(list)
  // ★仮にmap関数を使って上記のように書き換えると、
  // console表示は、[ [{}, {}], [{}, {}, {}]]となる


  // ✅ map と for...of の違い
  // map：各要素を加工して「新しい配列」を返す
  // for...of：各要素に処理をするだけ（返り値なし）
  // ✅ ※ 配列を作りたいなら map、処理だけなら for...of
  // ---------------------------------------------------------------


  for (const category of categories) {
    const items = menus.filter((menu) => menu.category === category)
      // ✅例えば1回目のループでcategoryがラーメンであれば、
      // menu.categoryがラーメンのオブジェクトが配列で返ってくる
      // 2回目のループでcategoryが丼物であれば、
      // menu.categoryがラーメンの丼物が配列で返ってくる
      // [{ラーメン}, {ラーメン}][{丼物}, {丼物}, {丼物}]のようになる

      .map((menu): Menu => ({
        id: menu.id,
        name: menu.name,
        price: menu.price,
        photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
      }))
    categoryMenus.push(
      {
        categoryName: category,
        id: category,
        items: items,
      }
    )
  }
  return { data: categoryMenus }
  // ✅これはcategoryMenusをfor　ofの外側で宣言してるからfor　ofの外側でreturnできる
  // 出力側で分割代入として受け取りたいからキーを指定したのか 返り値が複数ある場合はこのようにオブジェクト形式にしてキーを指定する
  // error や meta を追加しやすくするため
}



export async function fetchMenus(primaryType: string) {
  const supabase = await createClient();
  const bucket = supabase.storage.from('menus')

  const { data: menuItems, error: menuItemsError } = await supabase
    .from("menus")
    .select("*")
    // ✅ 条件に一致した行の全カラムを取得する
    .eq("genre", primaryType);

  if (menuItemsError) {
    console.error('メニューの取得に失敗しました', menuItemsError)
    return { error: 'メニューの取得に失敗しました' };
  }

  const menus = menuItems.map((menu): Menu => (
    {
      id: menu.id,
      name: menu.name,
      price: menu.price,
      photoUrl: bucket.getPublicUrl(menu.image_path).data.publicUrl,
    }
  ))

  return { data: menus };

}
