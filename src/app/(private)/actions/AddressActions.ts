'use server'
import { getPlaceDetails } from "@/lib/restaurants/api";
// ✅'use server'を書かないとクライアントで呼び出したとき クライアント側で実行される
import { AddressSuggestion } from "@/types";


export async function selectSuggestionAction(suggestion: AddressSuggestion, sessionToken: string) {
  // const supabase = createClient();
  // const { error } = await supabase
  //   .from('addresses')
  //   // データベースのどのテーブルを操作するか
  //   .insert({
  //     place_id: suggestion.placeId,
  //     place_name: suggestion.placeName,
  //   })
  // if (error) {
  //   console.error(error)
  // }
  console.log('サーバーアクション', suggestion);
  const { data: locationData, error } = await getPlaceDetails(suggestion.placeId, ['location'], sessionToken)
  console.log('locationData', locationData)
  if (error || !locationData || !locationData.location || !locationData.location.latitude || !locationData?.location.longitude) {
    // ✅getPlaceDetails関数でresponse.okの場合でも取得出来ない場合があるので
    // || !locationData || !locationData.locationを書く必要がある

    // return error
    throw new Error('住所情報が取得できませんでした')
    // ✅handleSelectSuggestionのtry catch文のcatch (error) 
    // のerrorに渡す
  }
}