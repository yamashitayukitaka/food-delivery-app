✅return を書く場合
※呼び出し先で値が返ってくる（使用できる）

function add(a: number, b: number) {
  return a + b; // 呼び出し側は add(1,2) で 3 を受け取れる
}

const result = add(1,2); // result = 3

----------------------------------
✅return を書かない場合
※呼び出し先でundefinedが返る。呼び出し先で値を使用できない
function add(a: number, b: number) {
  const sum = a + b;
}

const result = add(1,2); // result = undefined

-----------------------------------------------------------------------------------------------------------
ケース	                                        return する必要あるか	               理由
関数の結果を呼び出し側で使う場合	                ✅ 必要	                           呼び出し側に値を渡すため
関数内で処理だけして呼び出し側は値を使わない場合	 ❌ 不要	                             値を返す必要がない
-----------------------------------------------------------------------------------------------------------



export async function getPhotoUrl(name: string, maxWidth: number = 400): Promise<string> {
  const apiKey = process.env.GOOGLE_API_KEY!;
  const url = `https://places.googleapis.com/v1/${name}/media?key=${apiKey}&maxWidthPx=${maxWidth}`;
  return url; // ✅ 呼び出し側でこの URL を受け取りたいので return する
}

この場合returnしないと実行先でundefinedが返ってしまいurlを使えない