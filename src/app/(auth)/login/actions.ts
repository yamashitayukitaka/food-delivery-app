'use server'
// ✅このファイルはサーバーコンポーネントでインポートされて使用されるので 'use server' を付ける が原則
import { createClient } from "@/utils/supabase/server";
import { redirect } from 'next/navigation'

export async function login() {

  //googleログイン
  console.log('google login');
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
    },
  })

  if (error) {
    console.error(error)
    // console.error は赤文字で出力され、基本的には console.log と同じようにメッセージを表示する。
  }
  if (data.url) {
    redirect(data.url) // use the redirect API for your server framework
  }
}

export async function logout() {
  const supabase = await createClient()
  // -----------------------------------------------------
  const { error } = await supabase.auth.signOut()
  // 上記には2つの機能がある
  // 1. ログアウトの実行
  // 2.オブジェクトの出力
  // 例
  // 成功したとき：
  // {
  //   data: {},
  //   error: null
  // }
  // 失敗したとき：
  //   {
  //   data: {},
  //   error: {
  //     message: "Session not found",
  //     name: "AuthApiError",
  //     status: 400
  //   }
  // }

  // ★出力されたオブジェクトの のうちerror プロパティのみを分割代入する。
  // -----------------------------------------------------
  if (error) {
    console.error(error)
    // console.error は赤文字で出力され、基本的には console.log と同じようにメッセージを表示する。
  }
  redirect('/login')
}

