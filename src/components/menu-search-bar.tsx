"use client";
// ✅onChangeを使っているので、クライアントコンポーネントに

import React, { useState } from "react";
import { Search } from "lucide-react";
import { useDebouncedCallback } from "use-debounce";
import { usePathname, useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";

export default function MenuSearchBar() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  // ✅クエリパラメーターを除いた現在のURLが取得できる
  console.log(pathname)
  const { replace } = useRouter();
  // ✅replaceを分割代入で取得

  const handleSearchMenu = useDebouncedCallback((inputText: string) => {
    const params = new URLSearchParams(searchParams);

    if (inputText.trim()) {
      // 空文字をtrimで除外
      // 除外後文字列が残ればtruthy
      // 除外後何も無ければfalsy
      params.set("searchMenu", inputText);
    } else {
      params.delete("searchMenu");
      // ✅何も入力してない場合はクエリパラメータを削除する
    }
    const query = params.toString();
    replace(query ? `${pathname}?${params.toString()}` : pathname);
    // ✅${pathname}?${params.toString()}は
    // ？が元々文字列だからクエリパラ―メーターの｛｝はjsの式しかいれられないので？の前後でクエリパラメーターを使う必要がある
  }, 500);

  return (
    <div className="flex items-center bg-muted rounded-full">
      <Search size={20} color="gray" className="ml-2" />
      <input
        type="text"
        placeholder="メニューを検索"
        className="flex-1 px-4 py-2 outline-none"
        onChange={(e) => handleSearchMenu(e.target.value)}
      // ✅今回は入力値をstateで管理して保持する必要がないため、HTMLをそのまま表示させる設計でよい
      />
    </div>
  )
}