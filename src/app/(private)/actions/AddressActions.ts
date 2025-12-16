'use server'
import { getPlaceDetails } from "@/lib/restaurants/api";
// ✅'use server'を書かないとクライアントで呼び出したとき クライアント側で実行される
import { AddressSuggestion } from "@/types";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";


export async function selectSuggestionAction(suggestion: AddressSuggestion, sessionToken: string) {
  const supabase = await createClient()
  console.log('サーバーアクション', suggestion);
  // throw new Error('selectSuggestionActionエラー')

  const { data: locationData, error } = await getPlaceDetails(suggestion.placeId, ['location'], sessionToken)
  // エラー時と成功時の返却と関数呼び出し元での受け取りについて.tsを参照

  console.log('locationData', locationData)
  if (error || !locationData || !locationData.location || !locationData.location.latitude || !locationData?.location.longitude) {
    // ✅getPlaceDetails関数でresponse.okの場合でも取得出来ない場合があるので
    // || !locationData || !locationData.locationを書く必要がある

    // return error
    throw new Error('住所情報を取得できませんでした')
    // ✅handleSelectSuggestionのtry catch文のcatch (error) 
    // のerrorに渡す
  }

  // データベースに保存処理
  const { data: { user }, error: useError } = await supabase.auth.getUser()
  //  ✅auth.getUser は
  //  auth.users テーブルの
  // 「今ログインしているユーザーの行」を取得する

  // ✅分割代入では、オブジェクトに存在するキー名(この場合 data と error)を指定しないと受け取れない
  // Supabase が返すオブジェクトには data と error が含まれている
  // {
  //   data: ...,
  //   error: ...
  // }

  console.log('ユーザー', user);
  if (useError || !user) {
    redirect('/login');
  }

  const { error: insertError, data: newAddress } = await supabase
    // ✅分割代入では、オブジェクトに存在する「キー名（この場合 error）」を指定しないと受け取れない
    .from('addresses')
    //supabase.from() では
    // テーブルの各行と、その行が持つカラム名（キー）と値のセットを取得できる
    .insert({
      name: suggestion.placeName,
      address_text: suggestion.address_text,
      latitude: locationData.location.latitude,
      longitude: locationData.location.longitude,
      // created_at: new Date().toISOString(),
      user_id: user.id,
      // ✅auth.usersテーブルのuser_idとaddressテーブルのuser_idはsupabaseの外部キー設定で紐づいているが
      // await supabase.auth.getUser()で取得したuser.idを使ってaddressテーブルのuser_idにセットする必要がある
      // 紐づいているからと言って、自動ではセットされない
      // なぜなら外部キーは「自動で値を入れる仕組み」ではない。整合性をチェックするだけだから。
    })
    .select('id').single()
  // ✅insert()のあとにselect()をつけると、挿入したデータを返却してくれる
  // ✅single()で1件分のデータをオブジェクトとして取得する
  if (insertError) {
    console.error('住所の保存に失敗しました', insertError);
    throw new Error('住所の保存に失敗しました')
  }

  const { error: updateError } = await supabase
    .from('profiles')
    .update({
      selected_address_id: newAddress.id,
    })
    // ✅insert は「新しい行を作る」、update は「既存行の中の指定したキーの値を上書きする」

    .eq('id', user.id)
  // eqはテーブルのどの行を更新するかを指定する
  // profilesテーブルのidが auth.users テーブルの
  // 「今ログインしているユーザーの行」のidと等しい行を更新する
  if (updateError) {
    console.error('プロフィールの更新に失敗しました', updateError);
    throw new Error('プロフィールの更新に失敗しました')
  }
}
