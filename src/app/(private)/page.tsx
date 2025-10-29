// ✅app　routerでフロントページのpage.tsxを（private)という()付のフォルダを作ってその配下にpage.tsxを作っても フロントページと認識される。
// App Router では `( )（丸括弧）フォルダはルーティングに影響しない という特殊な仕組みがあります。
// URLに影響しないため、フロントページとして機能します。
// ログイン後専用のファイル群だから(private)にした
export default function Home() {
  return (
    <div className="min-h-screen">
      <h1>Home</h1>
    </div>
  );
}
