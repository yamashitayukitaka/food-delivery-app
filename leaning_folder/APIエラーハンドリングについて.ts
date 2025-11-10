// ★ポイント
// ✅response.json()とcatch(error)で受け取るエラー内容は別物
// ・response.json()で受け取るエラー内容はfetch自体は成功時
// ・catch(error)で受け取るエラー内容はfetchや.json()自体が失敗時

export async function fetchRamenRestaurants() {
  try {
    const url = "https://places.googleapis.com/v1/places:searchNearby";
    const apiKey = process.env.GOOGLE_API_KEY!;
    const header = {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": apiKey,
      "X-Goog-FieldMask": "places.id,places.displayName,places.types,places.primaryType,places.photos",
    };
    const requestBody = {
      includedPrimaryTypes: ["ramen_restaurantああ"],
      maxResultCount: 10,
      locationRestriction: {
        circle: {
          center: {
            latitude: 35.6669248,//渋谷
            // 緯度
            longitude: 139.6514163,//渋谷
            // 経度
          },
          radius: 1000.0
        }
      },
      languageCode: "ja",
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
      return { error: `NearbySearchリクエスト失敗:${response.status}` }
    }

    // ✅await response.json()で取得できるエラー内容は
    // fetch自体は成功（サーバーに到達・レスポンスあり）のとき
    // レスポンス内容がエラー（400や500など）
    // → サーバー側から返ってきたエラー情報

    // ★例
    // {
    //   ok: false,
    //   status: 400,
    //   error: {
    //     code: 400,
    //     message: "Unsupported types: ramen_restaurantああ.",
    //     status: "INVALID_ARGUMENT"
    //   }
    // }


    const data = await response.json()
    return data;
  } catch (error) {

    // ※✅catch (error)で取得できるエラーは
    // fetchやjson()の実行自体が失敗した場合のエラー内容


    // ✅catch (error)で取得できるエラー例
    // ★1．fetch失敗時の例
    // const error = {
    //   name: "TypeError",
    //   message: "Failed to fetch",
    //   stack: "TypeError: Failed to fetch\n    at ...", // スタックトレース
    // }

    // ★2．const error = {
    //   name: "SyntaxError",
    //   message: "Unexpected token i in JSON at position 0",
    //   stack: "SyntaxError: Unexpected token i in JSON at position 0\n    at ...",
    // }

    console.log(error)
  }
}
