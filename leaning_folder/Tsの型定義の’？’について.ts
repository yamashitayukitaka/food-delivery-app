// TypeScriptにおける'?'の意味は
// ★1，|undefinde を型定義に加える
// ★2，オブジェクトが空の場合も許容する

// 例
// name?: stringと
// name: string | undefinedの違い

interface A {
  name?: string;
}

interface B {
  name: string | undefined;
}

const a1: A = {}; // ✅ OK（プロパティ自体がなくてもよい）
const a2: A = { name: "Tokyo" }; // ✅ OK
const a3: A = { name: undefined }; // ✅ OK（存在してもundefinedは許容）

const b1: B = {}; // ❌ エラー（nameがない）
const b2: B = { name: "Tokyo" }; // ✅ OK
const b3: B = { name: undefined }; // ✅ OK
