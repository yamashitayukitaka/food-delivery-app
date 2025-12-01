'use client'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"

import { useEffect, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';


export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState<string>('')
  const [sessionToken, setSessionToken] = useState<string>(uuidv4());
  //  uuidv4()で任意の毎回異なるランダムな文字列が取得できる（import { v4 as uuidv4 } from 'uuidが必要)
  //✅検証ツール-->component--->PlaceSearchBarで検索で上記3つのstateの状態を確認できる

  const handleBlur = () => {
    setOpen(false)
  }

  const handleFocus = () => {
    if (inputText) {
      setOpen(true)
    }
  }



  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    // ✅毎回入力するたび(inputTextが更新される度)呼び出すとAPIの料金は高額になるので
    // useDebouncedCallbackパッケージを使用して、入力してから500ミリ秒後に実行される
    // ようにする
    console.log(input)
    try {
      const response = await fetch(`api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`, {
        // クエリパラメーターを2つ使うときは&で繋げる
        method: "GET",
        // headers: {
        //   "Content-Type": "application/json",
        // },
        // body: JSON.stringify({ sessionToken }),
      });


      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }

      // const data = await response.json();
      // console.log(data); // データ使用
    } catch (error) {
      console.error('Error:', error);
    }
    //   ✅この関数は、useEffect内で使用されるので、 catch (error)でエラー内容を取得する必要がある。
    // fetchRamenRestaurants()などのようにはレンダリング実行過程内で行われる関数は
    // Next.jsではerror.tsxが使用されるが、fetchSuggestions()は、useEffectでレンダリング実行後に行われるので
    //   catch (error)でエラー内容を受け取る必要がある
    //   ★onClickなどで呼び出されるfetch関数も、レンダリング後に呼び出されるので、catch (error)でエラー内容を受け取る必要がある
  }, 500)


  useEffect(() => {
    if (!inputText.trim()) {
      // inputText.trim() === ''とほぼ同意
      // 「入力が空文字、または空白のみ」の場合に閉じる
      setOpen(false);
    } else {
      setOpen(true); // 入力がある場合は開く
    }
    // ✅inputTextが更新されたあとに実行されるべき処理なので
    // setOpen(true)はinputTextを引数にとるuseEffect内で実行させる

    fetchSuggestions(inputText)


  }, [inputText])
  // ✅イベントハンドラ内でfetchを呼び出すのではなく確実に 
  // inputTextが更新されたあとにfetchしたいので 
  // useEffectで管理する 
  // ※イベントハンドラのタイミングでfetchを呼び出すときは、useEffectで管理するのが基本




  return (
    <Command className="overflow-visible bg-muted" shouldFilter={false}>
      <CommandInput placeholder="Type a command or search..."
        value={inputText}
        onValueChange={
          // (text) => {
          // setOpen(true)
          // ✅inputTextが更新されたあとに実行されるべき処理なので
          // setOpen(true)はinputTextを引数にとるuseEffect内で実行させる

          // ✅ onValueChange は shadcn/ui が内部で使っている cmdk ライブラリ独自のイベント。
          // ✅ 入力された文字列が引数として渡される
          // setInputText(text)
          // fetchSuggestions()
          // ここでfetchSuggestions()を呼び出すと
          // setInputText は即時反映されないので、
          // 直後に fetch すると古い値で実行される可能性があります。
          // }
          setInputText
          //✅onValueChange は「入力された値 (text) を自動で引数として渡してくれる関数プロパティ」です。
          //だから、setInputText のように 引数として文字列を受け取る関数 をそのまま渡せば、
          // onValueChange={(text) => {setInputText(text)}}と
          // 同じ処理になります。

        }
        onBlur={handleBlur}
        // ✅ onBlur は React 標準のイベント
        // ✅ input がフォーカスを失ったタイミングで発火
        // ✅ cmdk 独自ではなく通常の DOM input イベント
        onFocus={handleFocus}
      />



      {/* <input
      value={inputText}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        setInputText(e.target.value)
      }}
      /> */}
      {/* React の通常の <input> の場合
      この場合は onChange が使われ、イベントオブジェクトが渡されます。
      文字列は e.target.value で取得します。 */}



      {open && (
        <div className="relative">
          <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
            {/* 上記はclassNameというprops名でtailwindCSSのclass名を渡している。文字列なので{}をつかう必要が無い*/}
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandItem>Calendar</CommandItem>
            <CommandItem>Search Emoji</CommandItem>
            <CommandItem>Calculator</CommandItem>
            <CommandSeparator />
          </CommandList>
        </div>
      )
        // {open && (...)} の形を使う場合、丸括弧 () は 必須ではない です。ただし、複数行の JSX を書くときは推奨される というだけです。
        // 理由：
        // && の右側が 単一要素 なら括弧なしでも動作します。
        // 複数行 JSX の場合は括弧で囲むことで可読性が向上し、改行による構文エラーを防げます。
      }
    </Command>
  )

}


