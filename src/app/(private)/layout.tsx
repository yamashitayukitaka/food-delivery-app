// ✅(private)の中にlayout.tsxを作ったら private時の共通項目は ルートディレクトリ直下のlayout.tsxではなくこちらが適応される
// App Routerでは (private)/layout.tsx を作成すると、
// (private) グループ配下のページ専用レイアウト が適用されます。

// ---------------------------------------------------

// 1. 同一フォルダ内の layout.tsx
// まず同じ階層に layout.tsx があれば、それが優先して適用されます。
// この layout が children を持っている場合、同階層の page.tsx や下層のページがその children 内にレンダリングされます。

// 2. 親フォルダの layout.tsx
// 同階層に layout.tsx がない場合は、一つ上のフォルダの layout.tsx を探します。
// 親フォルダに layout.tsx があれば、それが適用されます。

// 3. さらに上層（最終的にプロジェクト直下）の layout.tsx
//    下層ページから順に上層をたどっても layout.tsx が見つからなければ、プロジェクト直下の layout.tsx が適用されます。

import Header from "@/components/ui/header";
export default function PrivatePageLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />

      <main className="pt-16 max-w-7xl mx-auto px-10">
        {children}
      </main>
      {/*{children}は同一階層または下階層のpage.tsxの内容を出力する子コンポーネントタグのようなもの */}
      {/* URLがURL/下階層フォルダ名/の場合は下階層フォルダ名/page.tsxの内容がlayout.tsxのchildrenが受け取り適応される */}
    </>
  );
}
