// ✅app　routerでフロントページのpage.tsxを（private)という()付のフォルダを作ってその配下にpage.tsxを作っても フロントページと認識される。
// App Router では `( )（丸括弧）フォルダはルーティングに影響しない という特殊な仕組みがあります。
// URLに影響しないため、フロントページとして機能します。
// ログイン後専用のファイル群だから(private)にした

import Section from "@/components/ui/section";


// ✅補足すると、Next.js（App Router）ではフォルダ名を ()で囲む と「URLパスに影響しないグルーピングフォルダ」として扱われます。
// したがって：

// app/
//  ├─ (private)/
//  │    └─ page.tsx
//  └─ layout.tsx


// この構成では、
// (private) は ルーティング上無視される ため、
// app/(private)/page.tsx は
// ルート (/) に対応する page.tsx として扱われます。

// ✅(private) が URL に影響しないため、http://localhost:3000 で最優先の page.tsx とみなされる



export default function Home() {
  return (
    <Section title="近くのお店">
      <div>scroll_area</div>
    </Section>
  );
}
