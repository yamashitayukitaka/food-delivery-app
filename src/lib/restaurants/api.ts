// ✅ この処理はサーバーサイドで使用する前提であり、
// 秘密鍵や server-only API を含むため
// クライアントコンポーネントから直接実行することはできない。
//
// クライアントから実行したい場合は、
// Server Action として 'use server' を宣言し、
// Next.js が許可するイベント経路
//（form action / startTransition など）
// 経由で呼び出す必要がある。
//
// しかし本処理は、Next.js が許可するイベント経由で呼び出す用途ではなく
// サーバー内で宣言して利用する前提のため、
// クライアントコンポーネントでは利用できない。



import { GooglePlacesAutoDetailsApiResponse, GooglePlacesSearchApiResponse, placeDetailsAll, Restaurant } from "@/types";
import { transformPlaceResults } from "./utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

// 近くのレストランを取得
export async function fetchRestaurants(lat: number, lng: number) {
  // throw new Error('testエラー');
  // 意図的にエラーを起こさせる
  const url = "https://places.googleapis.com/v1/places:searchNearby";
  const apiKey = process.env.GOOGLE_API_KEY!;
  // ✅はい、その ! は 「この値は絶対に undefined（または null）にならない」
  // と TypeScript に保証（宣言）するた✅
  const header = {
    "Content-Type": "application/json",
    // ✅bodyがJSON形式であることを伝える
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.primaryType,places.photos",
    // ✅places APIから受け取りたいデータを指定
  };


  const desiredTypes = [
    "japanese_restaurant",
    "cafe",
    "cafeteria",
    "coffee_shop",
    "chinese_restaurant",
    "fast_food_restaurant",
    "hamburger_restaurant",
    "french_restaurant",
    "italian_restaurant",
    "pizza_restaurant",
    "ramen_restaurant",
    "sushi_restaurant",
    "korean_restaurant",
    "indian_restaurant",
  ];

  const requestBody = {
    includedTypes: desiredTypes,
    maxResultCount: 10,
    // 取得するデータの件数
    locationRestriction: {
      // 取得するデータの地点
      circle: {
        center: {
          latitude: lat,
          // 緯度
          longitude: lng,
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
    // ✅errorというキー名で値に`NearbySearchリクエスト失敗:${response.status}`をもつオブジェクトを返す
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const nearbyPlaces = data.places
  // console.log('nearbyPlaces', nearbyPlaces);
  const matchingPlaces = nearbyPlaces.filter(
    (place) => place.primaryType && desiredTypes.includes(place.primaryType)
  );
  console.log('matchingPlaces', matchingPlaces);

  const Restaurants = await transformPlaceResults(matchingPlaces);

  // console.log(Restaurants);
  // returnしないと呼び出し側で値を受け取れない。呼び出し側でundefinedになる  
  return { data: Restaurants }
  // ✅dataというキー名で値にRestaurantsの中身をもつオブジェクトを返す
}





// ✅下記async function　fetchRamenRestaurants()関数は3つのPromiseを返す
// 1.async function fetchRamenRestaurants()自体がPromiseを返す。(async function 自体も Promiseを返す）
// 2.fetch() は Promise を返す
// 3.response.json() も Promise を返す
// ★注）async function　fetchRamenRestaurants()関数はasyncでラップしているので非同期関数になるので、
// 別ファイルなどで呼び出す際、後続のコードが、返り値であるdataを扱う際は、dataが返ってくるまで、後続のコードの実行を待機される必要があるのでawaitを付与する必要がある


// 近くのラーメン店を取得
export async function fetchRamenRestaurants(lat: number, lng: number) {
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
          latitude: lat,//渋谷
          // 緯度
          longitude: lng,//渋谷
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
    // ✅errorというキー名で値に`NearbySearchリクエスト失敗:${response.status}`をもつオブジェクトを返す
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const nearbyRamenPlaces = data.places

  const RamenRestaurants = await transformPlaceResults(nearbyRamenPlaces)
  // console.log(RamenRestaurants);
  // returnしないと呼び出し側で値を受け取れない。呼び出し側でundefinedになる  
  return { data: RamenRestaurants }
  // ✅dataというキー名で値にRamenRestaurantsの中身をもつオブジェクトを返す
}


//カテゴリ検索機能
export async function fetchCategoryRestaurants(category: string, lat: number, lng: number) {
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
    includedPrimaryTypes: [category],
    maxResultCount: 10,
    // 取得するデータの件数
    locationRestriction: {
      // 取得するデータの地点
      circle: {
        center: {
          latitude: lat,//渋谷
          // 緯度
          longitude: lng,//渋谷
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
    // ✅errorというキー名で値に`NearbySearchリクエスト失敗:${response.status}`をもつオブジェクトを返す
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const nearbyCategoryPlaces = data.places

  const CategoryRestaurants = await transformPlaceResults(nearbyCategoryPlaces)
  // console.log(RamenRestaurants);
  // returnしないと呼び出し側で値を受け取れない。呼び出し側でundefinedになる  
  return { data: CategoryRestaurants }
  // ✅dataというキー名で値にCategoryRestaurantsの中身をもつオブジェクトを返す
  // { data: CategoryRestaurants }はCategoryRestaurantsの中身を値をもつオブジェクトを示す
}


// キーワード検索
export async function fetchRestaurantsByKeyword(query: string, lat: number, lng: number) {
  const url = "https://places.googleapis.com/v1/places:searchText";
  // ✅キーワード検索の場合は、エンドポイントが変わるので注意
  const apiKey = process.env.GOOGLE_API_KEY!;
  const header = {
    "Content-Type": "application/json",
    // ✅bodyがJSON形式であることを伝える
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": "places.id,places.displayName,places.primaryType,places.photos",
  };
  const requestBody = {
    textQuery: query,
    // primaryTypeがramen_restaurantの箇所のみを取得する
    pageSize: 10,
    // 取得するデータの件数
    // ✅キーワード検索ではmaxResultCountは非推奨なので、pageSizeを使う（公式ドキュメントより）
    locationBias: {
      // ✅キーワード検索の場合locationRestrictionを使用するとなぜか
      // エラーがでたので locationBiasを使用する
      // 取得するデータの地点
      circle: {
        center: {
          latitude: lat,//渋谷
          // 緯度
          longitude: lng,//渋谷
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
    method: 'POST',
    body: JSON.stringify(requestBody),
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `TextSearchリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesSearchApiResponse = await response.json();
  console.log(data)

  if (!data.places) {
    return { data: [] }
  }

  const textSearchPlaces = data.places

  const restaurants = await transformPlaceResults(textSearchPlaces)
  return { data: restaurants }
}


export async function getPhotoUrl(name: string, maxWidth: number = 400): Promise<string> {
  // 'use cache'を使用する場合は、非同期関数にする必要があるのでasyncを付与する
  // 'use cache'
  // ✅これを使用すれば、2回目以降呼び出す際、getPhotoUrlの引数が1回目と同一であればキャッシュが利用される
  console.log('getPhotoUrl実行');
  const apiKey = process.env.GOOGLE_API_KEY!;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url;
}


export async function getPlaceDetails(placeId: string, fields: string[], sessionToken?: string) {
  // 　sessionToken?: string は「引数につくオプショナルプロパティ」であり、
  //  TypeScript では “オブジェクトのキー” につけるものと まったく同じ意味で使える
  const fieldsParam = fields.join(',')
  // ✅joinメソッドは、配列の各要素を指定した文字列でつなげて1つの文字列を返します。
  // X-Goog-FieldMaskは、,区切りの文字列で指定するのでこのような処理をする


  const apiKey = process.env.GOOGLE_API_KEY!;
  // throw new Error('getDetailsエラー')
  // ✅最下位レイヤーからエラーを投げてるが次点上位レイヤーである、selectSuggestionAction関数にはtry catch文がないため
  // try catch文がある最上位レイヤーのAddressMoadal関数のcatchで受け取る



  let url: string;
  // 変数宣言にTs型定義

  if (sessionToken) {
    url = `https://places.googleapis.com/v1/places/${placeId}?sessionToken=${sessionToken}&languageCode=ja`;
  } else {
    url = `https://places.googleapis.com/v1/places/${placeId}?languageCode=ja`;
  }

  const header = {
    "Content-Type": "application/json",
    "X-Goog-Api-Key": apiKey,
    "X-Goog-FieldMask": fieldsParam,
  };

  //  const requestBody = {
  //   languageCode: 'ja',
  // }
  // ✅GETの場合bodyを指定できないので、エンドポイントURLに記述する


  const response = await fetch(url, {
    method: 'GET',
    // GETの明記は省略可能
    // body: JSON.stringify(requestBody),
    // ✅GETの場合bodyを指定できないので、エンドポイントURLに記述する
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `placeDetrailsリクエスト失敗:${response.status}` }
  }

  const data: GooglePlacesAutoDetailsApiResponse = await response.json();
  console.log(data)

  const results: placeDetailsAll = {}

  if (fields.includes('location') && data.location) {
    results.location = data.location
    // ✅空のオブジェクトに、挿入する
    // 例）
    // results = {
    //   location:{

    //   }
    // }
    // に
    // results = {
    //   location:{
    //  　 latitude: 35.6710403,
    // 　　longitude: 139.7345469
    //   }
    // }
    // のように挿入する
  }


  return { data: results }

}


// 
export async function fetchLocation() {
  const DEFAULT_LOCATION = {
    lat: 35.6669248,
    lng: 139.6514163,
  };

  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    redirect("/login");
  }

  // 選択中の緯度と経度を取得
  const { data: selectedAddress, error: selectedAddressError } = await supabase
    .from('profiles')
    .select(`
        addresses (
          latitude,
          longitude
        )
      `)
    .eq('id', user.id)
    .single()
  if (selectedAddressError) {
    console.error('緯度と経度の取得に失敗しました', selectedAddressError);
    throw new Error('緯度と経度の取得に失敗しました');
    // ✅呼び出し元でcatchが無ければ、app routerでは対応するerror.tsxが呼び出される
  }

  const lat = selectedAddress.addresses?.latitude ?? DEFAULT_LOCATION.lat;
  const lng = selectedAddress.addresses?.longitude ?? DEFAULT_LOCATION.lng;
  // ✅??は「null合体演算子」と呼ばれ、左側の値が null または undefined の場合に右側の値を返す演算子です。

  return { lat, lng };
};


