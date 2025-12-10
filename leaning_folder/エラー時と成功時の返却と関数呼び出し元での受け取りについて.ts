// ✅エラー時と成功時の返却と関数呼び出し元での受け取りについて

export async function getPlaceDetails(placeId: string, fields: string[], sessionToken?: string) {
  const fieldsParam = fields.join(',')

  const apiKey = process.env.GOOGLE_API_KEY!;
  let url: string;


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

  const response = await fetch(url, {
    method: 'GET',
    headers: header,
    next: { revalidate: 86400 }
  })

  if (!response.ok) {
    const errorData = await response.json()
    console.error(errorData)
    return { error: `placeDetrailsリクエスト失敗:${response.status}` }
    // ✅失敗時の返却
  }

  const data = await response.json();
  console.log(data)

  const results: placeDetailsAll = {}

  if (fields.includes('location') && data.location) {
    results.location = data.location
  }


  return { data: results }
  // ✅成功時の返却
}


export interface placeDetailsAll {
  location?: {
    latitude?: number;
    longitude?: number;
  }
}



// ✅受け取り側
const placeDetails = await getPlaceDetails(suggestion.placeId, ['location'], sessionToken)
// 上記のようにうけとった場合
// placeDetails={
//     error: string;
//     data?: undefined;
// } | {
//     data: placeDetailsAll;
//     error?: undefined;
// }
// のように渡される
// ★エラー時と成功時のデータが一つのオブジェクトとして渡される
// 上記のようにうけとった場合は、
// 出力時以下のように書く
// console.log('返却', placeDetails.data?.location?.latitude)



// ★しかし上記だと冗長になるので、
// 分割代入してキー名と同じ名前の変数として受け取るのが一般的
const { data, error } = await getPlaceDetails(suggestion.placeId, ['location'], sessionToken)
// このように書くと出力が
// console.log('分割代入返却', data?.location?.latitude)
// のようにシンプルになる


//★さらに受け取り変数名の用途を明確にするために、分割代入先の変数名を
// 適切な名前に変更する
const { data: locationData, error } = await getPlaceDetails(suggestion.placeId, ['location'], sessionToken)
// 出力
// console.log('分割代入返却', locationData?.location?.latitude)

