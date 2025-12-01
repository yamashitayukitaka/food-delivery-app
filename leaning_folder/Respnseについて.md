1.✅const response = await fetch(url);
上記のfetchが返すのは Responseオブジェクト

上記の結果のイメージ：
const response = Response {
  status: 200,
  ok: true,
  headers: Headers {},
  body: ReadableStream, // ← この中にPlaces APIのJSONが入っている
  json: async function json() {}
}


2.
✅const data = await response.json();
json()はResponseオブジェクトがもつメソッドであり
json()はでResponseオブジェクトの ReadableStreamにアクセスして JavaScriptのオブジェクトに変換してそのJavaScriptのオブジェクトを取得する。
json()は非同期関数なのでawaitで後続を待たせる

※json()の取得内容
{ 
  name: "Ramen Ichiraku",
  id: "abc123",
  displayName: {
    text: "ラーメン一楽",
    languageCode: "ja"
  },
  types: [
    "restaurant",
    "food",
    "point_of_interest",
    "establishment"
  ],
  primaryType: "restaurant",
  primaryTypeDisplayName: {
    text: "レストラン",
    languageCode: "ja"
  },
  // ...他にもgeometryやaddressComponentsなどが続く
};


最終結果(dataに取得されたJavaScriptオブジェクトが格納される)
const data = { 
  name: "Ramen Ichiraku",
  id: "abc123",
  displayName: {
    text: "ラーメン一楽",
    languageCode: "ja"
  },
  types: [
    "restaurant",
    "food",
    "point_of_interest",
    "establishment"
  ],
  primaryType: "restaurant",
  primaryTypeDisplayName: {
    text: "レストラン",
    languageCode: "ja"
  },
  // ...他にもgeometryやaddressComponentsなどが続く
};


3．✅出力
console.log(data.name)
console.log(data.primaryType)など


★ok:falseの場合はbody があれば、response.json()でエラーメッセージなどの内容が取得できる
















