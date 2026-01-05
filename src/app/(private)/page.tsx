// ✅app　routerでフロントページのpage.tsxを（private)という()付のフォルダを作ってその配下にpage.tsxを作っても フロントページと認識される。
// App Router では `( )（丸括弧）フォルダはルーティングに影響しない という特殊な仕組みがあります。
// URLに影響しないため、フロントページとして機能します。
// ログイン後専用のファイル群だから(private)にした

// ✅補足すると、Next.js（App Router）ではフォルダ名を ()で囲む と「URLパスに影響しないグルーピングフォルダ」として扱われます。
// したがって：

// app/
//  ├─ (private)/
//  │    └─ page.tsx
//  └─ layout.tsx

// この構成では、
// (private) は ルーティング上無視される ため、
// app/(private)/page.tsx は
// ルート (/) に対応する page.tsx として扱われます。

// ✅(private) が URL に影響しないため、http://localhost:3000 で最優先の page.tsx とみなされる
import Section from "@/components/ui/section";
import CarouselContainer from "@/components/ui/carousel-container";
import RestaurantCard from "@/components/ui/restaurant-card";
import { fetchLocation, fetchRamenRestaurants } from "@/lib/restaurants/api"
import { fetchRestaurants } from "@/lib/restaurants/api"
import RestaurantList from "@/components/ui/restaurant-list";
import Categories from "@/components/ui/categories";
import { fetchMenus } from "@/lib/menus/api";
import MenuList from "@/components/menu-list";
import MenuCard from "@/components/menu-card";
import { useModal } from "../context/modalContext";


export default async function Home() {
  const { lat, lng } = await fetchLocation();
  console.log('ホームページの緯度経度', { lat, lng });

  const { data: nearbyRamenRestaurants, error: nearbyRamenRestaurantError } = await fetchRamenRestaurants(lat, lng);
  const { data: nearbyRestaurants, error: restaurantsError } = await fetchRestaurants(lat, lng);

  //  fetchRamenRestaurants() は定義側で
  // { data: RamenRestaurants }
  // { error: `NearbySearchリクエスト失敗:${response.status}` }
  // { data: [] }
  // を返しているので
  // 分割代入でキー名を変数名することでそれぞれの値を受け取ることができる
  // ✅上記の場合は一旦dataという変数名で値受け取ってから変数名を nearbyRamenRestaurants に変更している

  const restaurant = nearbyRamenRestaurants?.[0];
  const primaryType = restaurant?.primaryType;
  // ✅オプショナルチェイニングは配列番号の前に.(ドット）をつけ忘れないようにする


  const { data: menus, error: menusError } = primaryType ? await fetchMenus(primaryType) : { data: [] };
  // ✅primaryType が存在する場合は fetchMenus を実行し、存在しない場合は data に空配列、error は undefined になる

  // ✅{ data: [] }と言う記述方法について↓
  //左辺が分割代入ということは 右辺はdataまたはerrorをキーにもつオブジェクトでなければならない なので左辺の分割代入のdataに空配列を渡すためには、左辺を｛data:[]}としなければならない

  console.log('unnko', menus)


  return (
    <>

      <Categories />

      {/* レストラン情報表示 */}
      {!nearbyRestaurants ? (
        <p>{restaurantsError}</p>
      ) : nearbyRestaurants.length > 0 ? (
        <Section title="近くのお店" expandedContent={<RestaurantList restaurants={nearbyRestaurants} />}>
          {/* ✅コンポーネント出力タグはpropsとして渡すことができる */}
          <CarouselContainer slideToShow={4}>
            {nearbyRestaurants.map((restaurant) => (
              <RestaurantCard restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにレストランがありません</p>
      )}


      {/* ラーメン店情報表示 */}
      {!nearbyRamenRestaurants ? (
        <p>{nearbyRamenRestaurantError}</p>
      ) : nearbyRamenRestaurants.length > 0 ? (
        <Section title="近くのラーメン店" expandedContent={<RestaurantList restaurants={nearbyRamenRestaurants} />}>
          <CarouselContainer slideToShow={4}>
            {nearbyRamenRestaurants.map((restaurant) => (
              <RestaurantCard restaurant={restaurant} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン店がありません</p>
      )}


      {/* <Section title="近くのお店">
      <CarouselContainer slideToShow={4}> */}

      {/* {Array.from({ length: 5 }).map((_, index) => ( */}
      {/* // fromは未定義の値の配列を指定した個数分作成するためのメソッド
          // 構造
          // [undefined, undefined, undefined, undefined, undefined]

          // .map((_, index)
          // mapの引数は第一引数に配列の各要素が入るが今回は使わないので無視するという意味で_, 第二引数にインデックス番号を取得している

          // ★つまり全体の意図は：「5回ループして <RestaurantCard /> をインデックス番号をkeyとして描画する」 */}
      {/* <RestaurantCard key={index} id={index} /> */}
      {/* ))} */}

      {/* ✅上記のmap展開後の構造イメージ 
        [
          <RestaurantCard key={0} />,
          <RestaurantCard key={1} />,
          <RestaurantCard key={2} />,
          <RestaurantCard key={3} />,
          <RestaurantCard key={4} />,
        ]  
        ★jsx内で上記のように配列を記述すると、その配列内の要素がすべて描画される
        例
        { [a,b,c,d,e] }
        → これで a,b,c,d,e がすべて描画される
        


　　　　　✅childrenはmap展開後の配列がPropsとして渡されるので今回の場合
　　　　　[
　　　　　　<RestaurantCard key={0} />, 
           <RestaurantCard key={0} />,
           <RestaurantCard key={1} />,
           <RestaurantCard key={2} />,
           <RestaurantCard key={3} />,
        　 <RestaurantCard key={4} />,
        ]
        がPropsとしてCarouselContainerに渡される */}
      {/* </CarouselContainer>
      </Section> */}

      {/* メニュー情報表示 */}
      {!menus ? (
        <p>{menusError}</p>
      ) : menus.length > 0 ? (
        <Section
          title={restaurant?.restaurantName}
          expandedContent={<MenuList menus={menus} />}
        >
          <CarouselContainer slideToShow={6}>
            {menus.map((menu) => (
              <MenuCard menu={menu} />
            ))}
          </CarouselContainer>
        </Section>
      ) : (
        <p>近くにラーメン店がありません</p>
      )}
    </>

  );
}
