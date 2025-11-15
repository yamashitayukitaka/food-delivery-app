// ✅下記async function　fetchRamenRestaurants()関数は3つのPromiseを返す
// 1.async function fetchRamenRestaurants()自体がPromiseを返す。(async function 自体も Promiseを返す）
// 2.fetch() は Promise を返す
// 3.response.json() も Promise を返す
// ★注）async function　fetchRamenRestaurants()関数はasyncでラップしているので非同期関数になるので、
// 別ファイルなどで呼び出す際、後続のコードが、返り値であるdataを扱う際は、dataが返ってくるまで、後続のコードの実行を待機される必要があるのでawaitを付与する必要がある

import { GooglePlacesSearchApiResponse, Restaurant } from "@/types";
import { transformPlaceResults } from "./utils";
import { log } from "console";

export async function fetchRamenRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY!;
  // ✅はい、その ! は 「この値は絶対に undefined（または null）にならない」
  // と TypeScript に保証（宣言）するた✅
  const header = {
    "Content-Type": "application/json",
    // ✅bodyがJSON形式であることを伝える
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
    // ✅places APIから受け取りたいデータを指定
  };
  const requestBody = {
    includedPrimaryTypes: ["ramen_restaurant"],
    // primaryTypeがramen_restaurantの箇所のみを取得する
    maxResultCount: 10,
    // 取得するデータの件数
    locationRestriction: {
      // 取得するデータの地点
      circle: {
        center: {
          latitude: 35.6669248,//渋谷
          // 緯度
          longitude: 139.6514163,//渋谷
          // 経度
        },
        radius: 1000.0
        // 半径500メートル
      }
    },
    languageCode: "ja",
    // 日本語でデータを取得する
    rankPreference: "DISTANCE",
  }
  const response = await fetch(url, {
    // const response = await fetch(url)とした場合、fetchは2方向の役割がある
    // 1.メソッドの従ったデータのやり取りをfetch先と行う
    // 2.fetch先から返却があった場合その値を受け取る
    // (今回のplaceAPIの場合はPOSTで必要なデータまで返ってくるが、
    // 通常の場合POSTしただけでは、返ってこない、
    // 通常返り値は欲しい場合はGETする必要がある
    method: 'POST',
    body: JSON.stringify(requestBody),
    // bodyは実際に送るデータのこと
    // ✅JSON.stringify は JavaScript のオブジェクト → JSON 文字列 に変換する関数
    headers: header,
    // ✅headersは
    // 「リクエストやレスポンスのメタ情報を定義する部分」です。
    //  つまり、送受信するデータの“扱い方や形式”を示す設定情報です。

    next: { revalidate: 86400 }
    // -----------------------------------------------
    // 24時間経ったらキャッシュを新しく更新する(✅キャッシュ（cache）**とは、後で再利用するために一時的に保存しておくデータのこと)
    // -----------------------------------------------

    // -----------------------------------------------
    // ✅キャッシュ更新の流れ
    // ★1．初回アクセス時
    // fetch が実行され、API（エンドポイント）にアクセス。
    // 取得したレスポンスをキャッシュに保存。

    // ★2．24時間以内の2回目以降のアクセス
    // API には再アクセスせず、キャッシュから返す（高速）。

    // ★3．24時間経過後の最初のアクセス
    // Next.js が「キャッシュの有効期限が切れた」と判断し、
    // → API に再アクセスして新しいデータを取得。
    // → 取得した新データでキャッシュを上書き。
    // -----------------------------------------------

    // -----------------------------------------------
    // ✅キャッシュが利用される条件は以下
    // 同じ内容（同じエンドポイント・headers・requestBody）で2回目以降呼び出した場合にキャッシュが利用される
    // -----------------------------------------------

  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `NearbySearchリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const nearbyRamenPlaces = data.places

  const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces)
  console.log(RamenRestaurants);

}


export async function getPhotoUrl(name: string, maxWidth: number = 400): Promise<string> {
  // 'use cache'を使用する場合は、非同期関数にする必要があるのでasyncを付与する
  'use cache'
  // ✅これを使用すれば、2回目以降呼び出す際、getPhotoUrlの引数が1回目と同一であればキャッシュが利用される
  console.log('getPhotoUrl実行');
  const apiKey = process.env.GOOGLE_API_KEY!;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url;
}   