✅else文が不要な場合

if (!data.places) {
  return { data: [] }
}

const nearbyPlaces = data.places;

✅returnには以下2つの意味がある
1．return は 呼び出し元に値を返す という目的が第一。
2．同時に 関数の実行をそこで終了させる という副次的な効果がある。
※returnで処理を中断させた場合、関数内の残りの処理は実行されない
逆に、条件に当てはまらい場合は実行される

結論：if文内でreturnを使用した場合は後続のコードに対して
else文は不要。
逆にif文内でreturnを使用していない場合はelseを明記しないと意図した動作をすることができない。







