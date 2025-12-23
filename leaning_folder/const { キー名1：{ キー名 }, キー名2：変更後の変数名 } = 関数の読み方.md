✅const { キー名1：{ キー名1オブジェクト内のキー名 }, キー名2：変更後の変数名 } = 関数    の読み方


例
const { data: { user }, error: useError } = await supabase.auth.getUser()

{ user }は

 data: {
    user: {...}
  },
  error: null
}

となっている場合
dataオブジェクトの中のキーuserの値を取得して値を格納する変数名をuserに変更して分割代入するという意味

注意）仮に
const { data: user, error: useError } = await supabase.auth.getUser()
とするとdataオブジェクトそのものの値を取得して値を格納する変数名をuserに変更するという意味




