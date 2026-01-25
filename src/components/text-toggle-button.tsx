'use client'
// useStateはクライアントコンポネントでしか使えないため、'use client' を付ける


import React, { use } from 'react'
import { useState } from "react"
import { Button } from "./ui/button"


// TextToggleButtonを親コンポーネントがサーバーコンポネントである場面で使うので
// 外部ファイルに切り出して、TextToggleButtonのみをクライアントコンポーネントにした。

export default function TextToggleButton() {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const handleChange = () => {
    setIsExpanded((prev) => !prev);
    // ✅setIsExpanded(!isExpanded)は期待通りにトグルされない可能性があるので避ける

  }
  return (
    <div>
      <Button onClick={handleChange}>
        {isExpanded ? "表示を戻す" : "すべて表示"}
      </Button>
    </div>
  )
}


