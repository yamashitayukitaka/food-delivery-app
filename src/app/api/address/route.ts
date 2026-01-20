import { Address } from "@/types";
import { createClient } from '@/utils/supabase/server'
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    let addressList: Address[] = [];
    let selectedAddress: Address | null = null;
    const supabase = await createClient()
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return NextResponse.json(
        { message: 'ユーザーが認証されていません' },
        { status: 401 }
        // ✅「ユーザーが認証されていない」場合は401ステータスコードを指定するのが標準
      )
    }
    const { data: addressData, error: addressError } = await supabase
      .from('addresses')
      .select('id, name, address_text, latitude, longitude')
      .eq('user_id', user.id)
    // ✅RLS（Enable users to view their own data only）を設定してあるので
    // .eq('user_id', user.id) を指定しないとデータがとれない
    //eqでauth.usersテーブルのuser.idとaddressesテーブルのuser_idが同じ行を取得する

    if (addressError) {
      console.error('住所情報の取得に失敗しました', addressError);
      return NextResponse.json(
        { error: '住所情報の取得に失敗' },
        { status: 500 }
      )
    }

    addressList = addressData;
    const { data: selectedAddressData, error: selectedAddressError } = await supabase
      .from('profiles')
      .select(`
        addresses (
          id,
          name,
          address_text,
          latitude,
          longitude
        )
      `)
      .eq('id', user.id)
      // ✅このidはaddressesテーブルのidではなくprofilesテーブルのid

      // profiles.id は auth.users.id と同じ（1ユーザー = 1行設計）
      // .eq('id', user.id) により、現在ログイン中ユーザーの profiles 行を特定している
      //
      // profiles.selected_address_id → addresses.id の外部キー制約があるため、
      // Supabase が JOIN を自動生成し、対応する addresses の行を取得できる
      //
      // また、addresses テーブル側にも RLS の SELECT 許可があるため、
      // 結合された addresses データが実際に返却される
      //
      // 外部キーが定義されていなければ、この書き方では取得できない
      .single()
    // ✅singleを付けないと、1件しか取得しないのに配列で返ってきてしまう


    if (selectedAddressError) {
      console.error('プロフィール情報の取得に失敗しました', selectedAddressError);
      return NextResponse.json(
        { error: 'プロフィール情報の取得に失敗しました' },
        { status: 500 }
      )
    }
    selectedAddress = selectedAddressData.addresses;

    console.log('addressesデータ', addressList);
    console.log('selected_addressデータ', selectedAddress);
    return NextResponse.json({ addressList, selectedAddress }, { status: 200 })

  } catch (error) {
    return NextResponse.json(
      { message: 'エラーが発生しました' },
      { status: 500 }
    )
  }
}




