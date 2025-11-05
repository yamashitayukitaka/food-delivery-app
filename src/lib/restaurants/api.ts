export async function fetchRamenRestaurants() {
  const url = "https://places.googleapis.com/v1/places:searchNearby";

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
    method: 'POST',
    body: JSON.stringify(requestBody),
    // bodyは実際に送るデータのこと
    // ✅JSON.stringify は JavaScript のオブジェクト → JSON 文字列 に変換する関数
  })

  const data = await response.json();
  // await response.json();これはJSON形式で返ってきたデータを Javascriptのオブジェクト形式にする
  return data;
}