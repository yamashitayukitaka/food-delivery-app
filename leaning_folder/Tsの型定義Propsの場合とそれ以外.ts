// ✅TypeScriptでは 「Props（オブジェクト）」に型を付ける場合と、単なる変数に型を付ける場合 では指定方法が異なります。

// ✅ 1. Props（オブジェクト引数）の場合
// 👉 分割代入する前のオブジェクト全体の型を指定する
// (分割代入後の型定義でない。分割代入前のPropsの状態を定義する)
interface Props {
  name: string
  age?: number
}

function User({ name, age }: Props) {
}


// ✅ 2. 単なる変数に型をつける場合
// 👉 変数そのものの型を直接定義する

interface PersonalInfo {
  name: string
  age?: number
}

const Personal: PersonalInfo = {
  name: 'yamada',
  age: 60
}
