✅Supabase の Google OAuth ログインの流れ
1.ユーザーが Google でログインをリクエスト
フロントエンドで supabase.auth.signInWithOAuth({ provider: 'google' }) を呼ぶ。
このとき、ユーザーは Google 側の認証画面にリダイレクトされる。

2.Google 側で認証
Google アカウントでログインし、アプリへのアクセスを許可すると、Google が認証情報を Supabase に返す。

3.Supabase が JWT を生成
Supabase は Google から受け取った情報をもとにユーザーを識別。
新規ユーザーなら ユーザー情報を Supabase データベースに保存。
既存ユーザーなら既存情報と照合。
このとき、Supabase は JWT（JSON Web Token）を生成。
※JWT は「文字列で表現された JSON データ」でログインに必要な暗号

4.SupabaseがJWT をブラウザに渡す
ブラウザのcookieにjwtが保存されこの時点でログインが完了。