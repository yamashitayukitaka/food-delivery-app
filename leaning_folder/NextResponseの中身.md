✅NextResponseの中身（プロパティ例）


プロパティ / メソッド	説明
status	HTTPステータスコード
headers	ヘッダー情報（Mapのように操作可能）
cookies	Cookie操作用オブジェクト
body	レスポンスの本文
url	レスポンスのURL
clone()	レスポンスをコピー
redirect(url)	リダイレクト用メソッド
json(data)	JSON形式で返すための静的メソッド
next()	Middleware で次に進める場合に使う


★Next.jsのルートハンドラーズから呼び出しもとへ必要なデータを
返却する場合は、Next.jsが提供するNextResponseを使用しないと
返却できない