'use client'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import {
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { useDebouncedCallback } from 'use-debounce';
import { v4 as uuidv4 } from 'uuid';
import { AddressSuggestion } from "@/types";
import { AlertCircle, LoaderCircle, MapPin, Trash2 } from "lucide-react";
import { deleteAddressAction, selectAddressAction, selectSuggestionAction } from "@/app/(private)/actions/AddressActions";
import useSWR from "swr";
import { Address } from "@/types";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

interface AddressResponse {
  addressList: Address[];
  selectedAddress: Address | null;
}

export default function AddressModal() {
  const [inputText, setInputText] = useState('')
  const [sessionToken, setSessionToken] = useState(uuidv4());
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  //  uuidv4()で任意の毎回異なるランダムな文字列が取得できる（import { v4 as uuidv4 } from 'uuidが必要)
  //✅検証ツール-->component--->PlaceSearchBarで検索で上記3つのstateの状態を確認できる
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const router = useRouter();


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
      const response = await fetch(`/api/address/autocomplete?input=${input}&sessionToken=${sessionToken}`, {
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

      const data: AddressSuggestion[] = await response.json();
      // ✅基本的に、最初に取得した元データ（おおもとのデータ）には型定義を行い、
      // そのデータを基に加工・展開して使い回す内部データには、必ずしも型定義を行う必要はなく、
      // 必要に応じて型定義を追加すればよい。
      console.log('地域', data); // データ使用
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
      return;
    }
    setIsLoading(true)
    // ✅inputTextが更新されたあとに実行されるべき処理なので
    // setOpen(true)はinputTextを引数にとるuseEffect内で実行させる
    fetchSuggestions(inputText);

  }, [inputText])
  // ✅イベントハンドラ内でfetchを呼び出すのではなく確実に 
  // inputTextが更新されたあとにfetchしたいので 
  // useEffectで管理する 
  // ※イベントハンドラのタイミングでfetchを呼び出すときは、useEffectで管理するのが基本

  const fetcher = async (url: string) => {
    //✅urlには/api/addressが入る
    //✅fetcher関数はuseSWR(/api/address, fetcher)が実行合図となる
    const response = await fetch(url);
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
      // ✅throw new Errorを使うことで、useSWRのerrorにエラー内容が渡される
      // デフォルトではルートハンドラーズからsupabase経由でのエラー内容はdata内に入るので
      // useSWRのerrorで受け取れないのでthrow new Errorでエラー内容をuseSWRのerrorに渡した
    }
    const data = await response.json();
    return data;
    // ✅成功時はdataが返されuseSWRのdataに渡される 
  }

  // ----------------------------------------
  // const { data, error, isLoading: loading }: { data: AddressResponse | null; error: any; isLoading: boolean } = useSWR(`/api/address`, fetcher)
  const { data, error, isLoading: loading, mutate } = useSWR<AddressResponse>(`/api/address`, fetcher)
  // ✅このerrorはルートハンドラーズにアクセスできなかった場合の fetch 自体の失敗内容
  // ＋ fetcher 内で throw された Error がすべて入る
  // デフォルトではルートハンドラーズからsupabase経由でのエラー内容はdata内に入る


  // ✅上下のコードの型定義はどちらも動作はするが、、ジェネリティクスを使う場合はerror: any; isLoading: booleanの型定義は省略できる
  // 下のコードの型定義が推奨される。返り値全体を手書きで型定義する方法は冗長で非推奨
  // ----------------------------------------




  // ✅成功時データdata、失敗時エラーerror、読み込み中の状態管理尾isLoading
  // ✅method を書いていない＝自動的に GETメソッドになる
  // useSWRはデフォルトではGET

  // ✅useSWRを使用するときは、ルートハンドラーズを使用する。
  // サーバーアクションズはURLを持たないから、fetchできない

  console.log('swr_data', data)

  if (error) {
    console.error('エラー', error);
    return <div>{error.message}</div>
  }
  if (loading) return <div>loading...</div>

  const handleSelectSuggestion = async (suggestion: AddressSuggestion) => {
    //✅サーバーアクションズ呼び出し
    // クライアントコンポーネント内で Supabase の CRUD を書くと、
    // ブラウザ側に API キーが露出してしまい、
    // 悪意あるユーザーが自由に Supabase へアクセスできる。
    // そのため、安全のために CRUD 操作はサーバーアクション内で実行する。
    // サーバーアクションでも、ルートハンドラーズでも OK。 
    try {
      await selectSuggestionAction(suggestion, sessionToken);
      setSessionToken(uuidv4());
      setInputText('');
      mutate();
      // ✅mutate()を実行することで、useSWRで取得したデータが最新化される
      // mutate()を実行しないと、保存した住所がAddressModal内の
      // 保存済み住所リストに反映されない
      router.refresh();
    } catch (error) {
      console.error(error)
      alert('予期せぬエラーが発生しました')
      // ✅fetch失敗時の処理はトリガー元で最上位レイヤーである
      // handleSelectSuggestionで処理する
      // ※理由）selectSuggestionActionやgetPlaceDetailsでもAPIでのfetchエラー処理は
      // 可能だがユーザーはトリガー元でエラーが確認できないと内部まではわからないので理解できないため


      // ✅try catch文のcatchは　
      // fetchのAPI接続エラー時の失敗内容か、
      // throw new Errorの値を受け取る 
      // throw new ErrorはfetchのAPI接続の失敗成功かは関係ない
    }
  }

  const handleSelectAddress = async (address: Address) => {
    console.log('address', address)
    try {
      await selectAddressAction(address.id);
      mutate();
      // mutate()を実行しないと、選択した住所がAddressModal内に反映されない
      // ✅<DialogTrigger>
      //   {data?.selectedAddress ?
      //     data.selectedAddress.name
      //     : '住所を選択'
      //   }
      // </DialogTrigger>
      // が更新されるのはmutateの影響
      router.refresh();
      // router.refresh() を呼び出した時点で表示中のルートを起点に、
      // そのルートに属するすべてのサーバーコンポーネントが再評価される
      // （router.refresh() を記述しているコンポーネント自身も含む）
      //
      // そのため、ルートURLのサーバーコンポーネント（Home）も必ず再評価され、
      // Home 内で呼ばれている fetchLocation() が再実行される
      // → 選択後の緯度・経度が取得される
    } catch (error) {
      console.error(error)
      alert('予期せぬエラーが発生しました')
    }
  }

  const handleDeleteAddress = async (addressId: number) => {
    console.log('addressId', addressId)
    const ok = window.confirm('住所を削除しますか？')
    // ✅window.confirm()はブラウザ組み込みの関数で
    // 確認ダイアログを表示し、ユーザーが「OK」をクリックした場合はtrue、
    // 「キャンセル」をクリックした場合はfalseを返す
    if (!ok) return;
    try {
      const selectedAddressId = data?.selectedAddress?.id;
      await deleteAddressAction(addressId);
      // mutate();
      // mutate()を実行しないと、削除した住所がAddressModal内に反映されない
      // ✅<DialogTrigger>
      //   {data?.selectedAddress ?
      //     data.selectedAddress.name
      //     : '住所を選択'
      //   }
      // </DialogTrigger>
      // が更新されるのはmutateの影響
      mutate();
      if (selectedAddressId === addressId) {
        // ✅削除した住所が選択中の住所だった場合は
        // HomeコンポーネントでfetchLocation()が再実行されないようにするために  
        router.refresh();
      }
    } catch (error) {
      console.error(error)
      alert('予期せぬエラーが発生しました')
    }
  }



  return (
    <Dialog>
      <DialogTrigger>
        {data?.selectedAddress ?
          data.selectedAddress.name
          : '住所を選択'
        }
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>住所</DialogTitle>
          <DialogDescription className="sr-only">
            住所登録と選択
          </DialogDescription>
        </DialogHeader>
        <Command shouldFilter={false}>
          <div className="bg-muted mb-4">
            <CommandInput
              value={inputText}
              onValueChange={setInputText}
            />
          </div>
          <CommandList>
            {inputText ? (
              <>
                <CommandEmpty>
                  <div className="flex items-center justify-center">
                    {isLoading ? (<LoaderCircle className="animate-spin" />) :
                      errorMessage ? (
                        <div className="flex items-center text-destructive gap-2">
                          <AlertCircle />{errorMessage}
                        </div>
                      ) : (
                        '住所が見つかりません。'
                      )}
                    {/* ✅lucide-reactはpropsでcssのクラス名を渡せる。classNameはprops名 */}
                  </div>
                </CommandEmpty>
                {suggestions.map((suggestion) => (
                  <CommandItem key={suggestion.placeId} className="p-5" onSelect={() => handleSelectSuggestion(suggestion)}>
                    <MapPin />
                    <div>
                      <p className="font-bold">{suggestion.placeName}</p>
                      <p className="test-muted-foreground">{suggestion.address_text}</p>
                    </div>
                  </CommandItem>
                ))}
              </>
            ) : (
              <>
                <h3 className="font-black text-lg mb-2">保存済みの住所</h3>

                {data?.addressList.map((address) => (
                  <CommandItem
                    onSelect={() => handleSelectAddress(address)}
                    key={address.id} className={cn("p-5 justify-between items-center", data.selectedAddress?.id === address.id && "bg-red-500")}>
                    {/* cn('デフォルトのクラス名', 条件と追加するクラス名) */}
                    <div>
                      <p className="font-bold">{address.name}</p>
                      <p className="test-muted-foreground">{address.address_text}</p>
                    </div>
                    <Button size="icon" variant={'ghost'} onClick={(e) => {
                      handleDeleteAddress(address.id);
                      e.stopPropagation();
                      // 子要素であるボタンをクリックすると親要素である
                      // CommandItemのonSelectも発火してしまうので、e.stopPropagationで防ぐ
                    }}>
                      {/* 引数を指定した場合は()=>{}で囲む必要がある */}
                      {/* shade cn ui */}
                      <Trash2 />
                      {/* lucide react */}
                    </Button>
                  </CommandItem>
                ))}
              </>
            )}
          </CommandList>
        </Command>
      </DialogContent>
    </Dialog>
  )
}