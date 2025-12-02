// ✅オプショナルチェイニングの？につい✅

// 出力：オプショナルチェイニング
// ✅suggestion?.placePrediction?.structuredFormat?.mainText?.text,
// オプショナルチェイニングはキー名?でそのキーが値にオブジェクトを持っているか確認し
// 持っていなければundefinedを返す

// suggestion?-->suggestionキーがPlacesAutoCompleteResultを持っているか確認、存在しなければ undefined
// placePrediction?-->placePredictionキーがオブジェクトを持っているか確認、存在しなければ undefined
// structuredFormat?-->structuredFormatキーがオブジェクトを持っているか確認、存在しなければ undefined
// structuredFormat?-->mainTextキーがオブジェクトを持っているか確認、存在しなければ undefined

// ★最後のtextにオプショナルチェイニング?を付ける必要つけようがないが無い理由
// 1.そもそもオブジェクトを値に持たないのでつけようがない

// 2.suggestion?.placePrediction?.structuredFormat?.mainText?
// これらは最後のtextに到達するためのものであり、途中でオブジェクトが存在しない場合は
// そもそもtextに到達しないので型エラーになる
// textにできれば、型エラーなしでtextのそのものに型定義してある値の文字列かundefinedを返せるのでいらない



// ★型定義
export interface GooglePlacesAutoCompleteResponse {
  suggestions?: PlacesAutoCompleteResult[];
}

export interface PlacesAutoCompleteResult {
  placePrediction?: {
    place?: string,
    placeId?: string,
    structuredFormat?: {
      mainText?: {
        text?: string,
      }
    }
  },
  queryPrediction?: {
    text?: {
      text?: string,
    }
  }
}





