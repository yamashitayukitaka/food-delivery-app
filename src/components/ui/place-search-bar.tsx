'use client'
import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { RestaurantSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Search } from "lucide-react";
import { useRouter } from "next/navigation";
// ✅next/router は Pages Router 用。next/navigationからインポートしないと正しく動作しない
import { useEffect, useRef, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';
import { useSearchParams } from "next/navigation";


export default function PlaceSearchBar() {
  const [open, setOpen] = useState(false);
  const [inputText, setInputText] = useState('')
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<RestaurantSuggestion[]>([]);
  //  uuidv4()で任意の毎回異なるランダムな文字列が取得できる（import { v4 as uuidv4 } from 'uuidが必要)
  //✅検証ツール-->component--->PlaceSearchBarで検索で上記3つのstateの状態を確認できる
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const clickedOnItem = useRef(false);
  const router = useRouter()
  const searchParams = useSearchParams();


  const fetchSuggestions = useDebouncedCallback(async (input: string) => {
    // ✅毎回入力するたび(inputTextが更新される度)呼び出すとAPIの料金は高額になるので
    // useDebouncedCallbackパッケージを使用して、入力してから500ミリ秒後に実行される
    // ようにする
    // 関数が呼ばれたタイミングでsetErrorMessageを空にする
    if (!input.trim()) {
      // input.trim() === ''とほぼ同意
      // 「入力が空文字、または空白のみ」の場合に閉じる
      setSuggestions([]);
      return;
    }
    setErrorMessage(null)
    console.log(input)
    try {
      const response = await fetch(`/api/restaurant/autocomplete?input=${input}&sessionToken=${sessionToken}`, {
        // クエリパラメーターを2つ使うときは&で繋げる
        // method: "GET",
        // headers: {
        //   "Content-Type": "application/json",
        // }
      });

      if (!response.ok) {
        const errorData = await response.json();
        setErrorMessage(errorData.error)
        return;
      }

      const data: RestaurantSuggestion[] = await response.json();
      console.log('suggestion_data', data); // データ使用
      setSuggestions(data)

    } catch (error) {
      console.error(error);
      setErrorMessage('予期せぬエラーが発生しました')
    }
    //   ✅この関数は、useEffect内で使用されるので、 catch (error)でエラー内容を取得する必要がある。
    // fetchRamenRestaurants()などのようにはレンダリング実行過程内で行われる関数は
    // Next.jsではerror.tsxが使用されるが、fetchSuggestions()は、useEffectでレンダリング実行後に行われるので
    //   catch (error)でエラー内容を受け取る必要がある
    //   ★onClickなどで呼び出されるfetch関数も、レンダリング後に呼び出されるので、catch (error)でエラー内容を受け取る必要がある
    finally {
      setIsLoading(false)
      // ✅tryブロックにsetIsLoading(false)を書いてしまうと
      // try文内でエラーが起こった場合に、setIsLoading(false)を実行する前にcatch文に移行し
      // エラーがおこってもsetIsLoading(false)の状態がつづいてしまうので、
      // finallyブロックに書いて、エラー時でも成功時でもsetIsLoading(false)が実行されるようにする
      // ★try文はエラーを感知した時点でcatchブロックに移行するので、感知以降のtry内の後続のコードが実行されない
    }
  }, 500)


  useEffect(() => {
    if (!inputText.trim()) {
      // inputText.trim() === ''とほぼ同意
      // 「入力が空文字、または空白のみ」の場合に閉じる
      setSuggestions([]);
      setOpen(false);
      return;
    }
    setIsLoading(true)
    setOpen(true); // 入力がある場合は開く
    // ✅inputTextが更新されたあとに実行されるべき処理なので
    // setOpen(true)はinputTextを引数にとるuseEffect内で実行させる
    fetchSuggestions(inputText);

  }, [inputText])
  // ✅イベントハンドラ内でfetchを呼び出すのではなく確実に 
  // inputTextが更新されたあとにfetchしたいので 
  // useEffectで管理する 
  // ※イベントハンドラのタイミングでfetchを呼び出すときは、useEffectで管理するのが基本

  const handleBlur = () => {
    if (clickedOnItem.current) {
      clickedOnItem.current = false
      return;
    }
    setOpen(false)
  }

  const handleFocus = () => {
    if (inputText) {
      setOpen(true)
    }
  }

  const handleSelectSuggestion = (suggestion: RestaurantSuggestion) => {
    console.log('suggestion', suggestion)
    if (suggestion.type === 'placePrediction') {
      router.push(`/restaurant/${suggestion.placeId}?sessionToken=${sessionToken}`)
    }
    else {
      router.push(`/search?restaurant=${suggestion.placeName}`)
    }
    setOpen(false)
  }

  const handleOnKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    console.log(e)
    if (!inputText.trim()) return;
    if (e.key === "Enter") {
      // ✅e.keyは値にイベント発火時に押したキーボードのキー名を取る
      // ✅onKeyDownは任意のボタンを押したタイミングで毎回発火する 
      // そのうちEnterを押した場合にのみroute.pushが発火する
      router.push(`/search?restaurant=${inputText}`)
    }
  }


  return (
    <Command onKeyDown={handleOnKeyDown} className="overflow-visible bg-muted" shouldFilter={false}>
      {/* ✅onKeyDownは任意のボタンを押したタイミングで毎回発火する */}
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
          <div className="relative">
            <CommandList className="absolute bg-background w-full shadow-md rounded-lg">
              {/* 上記はclassNameというprops名でtailwindCSSのclass名を渡している。文字列なので{}をつかう必要が無い*/}
              <CommandEmpty>
                <div className="flex items-center justify-center">
                  {isLoading ? (<LoaderCircle className="animate-spin" />) :
                    errorMessage ? (
                      <div className="flex items-center text-destructive gap-2">
                        <AlertCircle />{errorMessage}
                      </div>
                    ) : (
                      'レストランが見つかりません'
                    )}
                  {/* ✅lucide-reactはpropsでcssのクラス名を渡せる。classNameはprops名 */}
                </div>
              </CommandEmpty>
              {suggestions.map((suggestion, index) => (
                <CommandItem
                  className="p-5"
                  key={suggestion.placeId ?? index}
                  // ✅?? は 「左が null か undefined なら右を返す」

                  value={suggestion.placeName}
                  // ✅ value が空の場合、shadcn/ui(Command) の仕様上、CommandEmpty("No results found.") が表示される。
                  //  useDebouncedCallback による fetch 遅延（500ms）で、入力直後は suggestions がまだ取得されないため
                  //  一時的に No results found が表示されることがある
                  onSelect={() => handleSelectSuggestion(suggestion)}
                  // handleSelectSuggestionが引数をとるので、onSelect={() => handleSelectSuggestion(suggestion)}のようにかく
                  // onSelect={handleSelectSuggestion}はだめ
                  onMouseDown={() => clickedOnItem.current = true}
                >
                  {suggestion.type === 'placePrediction' ?
                    <Search /> :
                    <MapPin />
                  }
                  <p>
                    {suggestion.placeName}
                  </p>
                </CommandItem>
              ))}
              <CommandSeparator />
            </CommandList>
          </div>
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


