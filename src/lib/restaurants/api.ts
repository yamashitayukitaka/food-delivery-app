export async function fetchRamenRestaurants() {
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
  const requestBody = {
    // "includedTypes": ["restaurant"],
    maxResultCount: 10,
    // 取得するデータの件数
    locationRestriction: {
      // 取得するデータの地点
      circle: {
        center: {
          latitude: 37.7937,
          // 緯度
          longitude: -122.3965
          // 経度
        },
        radius: 500.0
        // 半径500メートル
      }
    },
    langageCode: "ja",
    // 日本語でデータを取得する
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
    headers: header
    // ✅headersは
    // 「リクエストやレスポンスのメタ情報を定義する部分」です。
    //  つまり、送受信するデータの“扱い方や形式”を示す設定情報です。
  })

  const data = await response.json();
  // await response.json();これはJSON形式で返ってきたデータを Javascriptのオブジェクト形式にする
  return data;
}