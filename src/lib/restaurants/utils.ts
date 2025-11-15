// ✅utils.ts は 「複数箇所で使う便利な関数をまとめるためのファイル」

import { PlaceSearchResult, Restaurant } from "@/types";
import { getPhotoUrl } from "./api";
// ✅const nearbyRamenPlaces = data.places
// transformPlaceResults(nearbyRamenPlaces)
// 呼び出し側のコードは上記のようになっているが、

// 定義側はtransformPlaceResults(restaurants: PlaceSearchResult[])のように
// data.placesを受けとる変数名がrestaurantsとなっている
// 変数名は呼び出し側と定義側で異なっていても問題ない
// 問題なく、restaurantsにdata.placesが渡される


export async function transformPlaceResults(restaurants: PlaceSearchResult[]) {
  // ✅async functionのasyncはawait Promise.all(promises)でawaitを使う為に付与している
  const promises = restaurants.map(async (restaurant): Promise<Restaurant> => (
    // ✅Promiseの返り値に対する型定義はPromise<Restaurant>のように記載する


    // ✅map(async関数を使うとPromiseの配列が返る
    // これは、await getPhotoUrlでawaitを使っている為、asyncを付与している
    {
      id: restaurant.id,
      restaurantName: restaurant.displayName?.text,
      // ✅オブジェクトがundefindeになる場合は？を付ける必要がある
      // restaurant.displayName が undefined または null の場合
      // ?.（オプショナルチェイニング）によって 評価は止まり、結果は undefined になる
      // つまり restaurant.displayName が存在しなければ text にアクセスせず、undefined が返る
      // restaurant.displayName が存在する場合
      // restaurant.displayName.text が返される
      // もし text が undefined なら、そのまま undefined が返る
      primaryType: restaurant.primaryType,
      // ✅値がundefinedになる可能性がある場合は?を付与する必要は無い

      // photoUrl: restaurant.photos?.[0]?.name
      //   ? await getPhotoUrl(restaurant.photos[0].name)
      //   : "/no_image.png",
      photoUrl: "/no_image.png",
    }
  ))
  const data = await Promise.all(promises)
  // ✅map関数はPromiseが解決する前に配列を返すので、そのままだと解決しないので
  // Promise.allで再度ラップして解決させる。
  // Promise.allは配列を引数にとり、その配列内の全てのPromiseが同時に実行され
  // 全て解決するのを待つ
  return data;
  // returnしないと呼び出し側で値を受け取れない。呼び出し側でundefinedになる
}

