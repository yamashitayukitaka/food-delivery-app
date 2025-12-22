// ✅return NextResponse.jsonの各々の箇所はそこで後続の処理は終了

// ✅google api keyは外に情報が洩れたらいけないので、サーバーサイドで実行する為に
// ルートハンドラーズでAPIを呼びだす


import { GooglePlacesAutoCompleteResponse, RestaurantSuggestion } from '@/types';
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const input = searchParams.get('input')
  const sessionToken = searchParams.get('sessionToken')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  // ✅公式ドキュメントより、ルートハンドラーズでURLのクエリパラメータを取得するコード
  // ✅searchParams.get('キー名') でクエリパラメーターの値を取得できる


  console.log('input', input);
  console.log('sessionToken', sessionToken);
  // ✅ルートハンドラーズのコンソールはブラウザで確認できないので、ターミナルで確認する

  if (!sessionToken) {
    return NextResponse.json({ error: "文字を入力してください" }, { status: 400 })
  }
  if (!sessionToken) {
    return NextResponse.json({ error: "セッショントークンは必須です" }, { status: 400 })
  }
  // ★Next.jsのルートハンドラーズから呼び出しもとへ必要なデータを
  // 返却する場合は、Next.jsが提供するNextResponseを使用しないと
  // 返却できない

  try {
    const url = 'https://places.googleapis.com/v1/places:autocomplete';
    const apiKey = process.env.GOOGLE_API_KEY!;
    const header = {
      "Content-Type": "application/json",
      // ✅bodyがJSON形式であることを伝える
      "X-Goog-Api-Key": apiKey,

    };

    const requestBody = {
      includeQueryPredictions: true,
      // 検索予測キーワードを取得
      input: input,
      // const input = searchParams.get('input')を値に指定
      // 取得するデータの件数
      sessionToken: sessionToken,
      includedPrimaryTypes: ["restaurant"],
      locationBias: {
        // 指定されたエリア外の結果を含め、指定された位置周辺の結果が返される可能性があり
        circle: {
          center: {
            latitude: lat,
            longitude: lng,
          },
          radius: 1000.0,
        },
      },
      languageCode: "ja",
      regionCode: "jp",
    };

    const response = await fetch(url, {
      // const response = await fetch(url)とした場合、fetchは2方向の役割がある
      // 1.メソッドの従ったデータのやり取りをfetch先と行う
      // 2.fetch先から返却があった場合その値を受け取る
      method: 'POST',
      body: JSON.stringify(requestBody),
      // bodyは実際に送るデータのこと
      // ✅JSON.stringify は JavaScript のオブジェクト → JSON 文字列 に変換する関数
      headers: header,
      // ✅headersは
      // 「リクエストやレスポンスのメタ情報を定義する部分」です。
      //  つまり、送受信するデータの“扱い方や形式”を示す設定情報です。
    })

    if (!response.ok) {
      const errorData = await response.json();
      // ★取得できるresponseの中身
      //   Response {
      //   status:,
      //   ok: false,
      //   headers: Headers {},
      //   body: ReadableStream, // ← この中にPlaces APIのJSONが入っている
      //   json: async function json() {}
      // }

      // errorData は body: ReadableStrea JSONパース後の JS オブジェクト

      // ★json()はでResponseオブジェクトの ReadableStreamを読み取り
      // JavaScriptのオブジェクトに変換してそのJavaScriptのオブジェクトを返す。
      // ★ok:falseの場合はbody があれば、response.json()でエラーメッセージなどの内容が取得できる
      console.error(errorData);
      return NextResponse.json({ error: `Autocompleteリクエスト失敗:${response.status}` }, { status: 500 });
      // ✅errorというキー名で値に`Autocompleteリクエスト失敗:${response.status}`をもつオブジェクトを返す
      // ✅{ status: 500 }のように明示的statusを示さないとデフォルトでstatusが200になる
      // 200はok:trueなので returnの受け取り先でエラーを受け取りたいのにok:trueになってしまい。（200番台は成功を表すステータスコード）
      // 受取先でif(!response.ok){}が通らなくなる

      // ★{ status: 500 }のように明示することで、Responseオブジェクト内のstatusが200から更新される
    }

    const data: GooglePlacesAutoCompleteResponse = await response.json()
    const suggestions = data.suggestions ?? []
    const results = suggestions.map((suggestion) => {
      if (
        suggestion.placePrediction &&
        suggestion.placePrediction.placeId &&
        suggestion.placePrediction.structuredFormat?.mainText?.text) {
        // ✅placeIdとplaceNameが取得できなかった場合、は何表示しないようにするために
        // 条件式に&& suggestion?.placePrediction?.placeId && suggestion?.placePrediction?.structuredFormat?.mainText?.text
        // を追加して取得できたときにのみ実行するようにする。
        return {
          type: 'placePrediction',
          placeId: suggestion.placePrediction.placeId,
          placeName: suggestion.placePrediction.structuredFormat.mainText?.text,
        }
      } else if (
        suggestion.queryPrediction &&
        suggestion.queryPrediction.text?.text) {
        return {
          type: 'queryPrediction',
          placeName: suggestion.queryPrediction.text?.text,
        }
        // ✅命名関数を呼び出す場合にreturnがないと呼び出し元へ返す値がundefinedになるのと同様に、
        //  変数に値を格納する場合returnを付けないと、変数に格納した値がundefinedになる
        //  そのためreturnをつける
      }
    }).filter((suggestion): suggestion is RestaurantSuggestion => (suggestion !== undefined))
    // [配列].filter((配列の各値を受け取る)=>条件式)
    // で条件に当てはまる値の配列を返す
    // ★map関数は配列を返す


    // ✅ifにもelse ifにも当てはまらない場合はundefinedが返ってしまうので
    // filterでundefinedを除外する

    // console.log('results', results)
    console.log(data, JSON.stringify(data, null, 2))
    return NextResponse.json(results)

  } catch (error) {
    return NextResponse.json({ error: '予期せぬエラーが発生しました' })
  }
}
