import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetFooter,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet"
import { Heart, Menu } from 'lucide-react';
import { Button } from "@/components/ui/button"
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Bookmark } from 'lucide-react';
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
// 今回はサーバーコンポーネントなのでimport文でサーバーコンポーネント用のcreateClient()を使用する
// 注）クライアントコンポーネントでは、必ず クライアント用の createClient() を使用する必要がある
import { logout } from "@/app/(auth)/login/actions";




const MenuSheet = async () => {

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser()
  // getUser()が非同期関数なのでawaitで後続の処理をsupabase.auth.getUser()の完了まで待機させる必要がある。
  // getUserがイベントループに入る間に他の後続の同期処理が実行されると、user情報が取得できないまま後続の処理が進んでしまうため。

  if (!user) {
    redirect('/login') // user情報がない場合はログインページへリダイレクトする
  }

  const { avatar_url, full_name } = user.user_metadata;
  // user.user_metadata オブジェクトからavatar_url と full_name という プロパティ名が一致する値 を取り出しています。


  return (
    <Sheet>
      <SheetTrigger asChild>
        {/* asChild を指定すると、<SheetTrigger> が自分自身で <button> を生成しなくなる
        　　指定しない場合は <SheetTrigger> が内部で button を生成するため、Button コンポーネント自身も
        <button>になるため二重に<button>が生成されてしまうエラーの原因になる。
        */}
        <Button variant="ghost" size="icon">
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent className="w-72 p-6" side="left">
        <SheetHeader className="sr-only">
          <SheetTitle>メニュー情報</SheetTitle>
          <SheetDescription>
            ユーザー情報とメニュー情報
          </SheetDescription>
          {/* <SheetTitle>や <SheetDescription>はスクリーンリーダー用（視覚障碍者用に読み上げる）のために必ず書かないとエラーになるで
          非表示にするにはclassName="sr-only"を付ける。display:noneにするとスクリーンリーダーも読み取れなくなるためNG*/}

          {/* ✅視覚障がい者や弱視者のために、画面上に表示されているテキスト情報やUI要素（ボタン、リンク、見出しなど）を音声または点字ディスプレイで読み上げ・出力する支援技術（assistive technology）のことです。 */}
          {/* .sr-only {
              position: absolute;
              width: 1px;
              height: 1px;
              padding: 0;
              margin: -1px;
              overflow: hidden;
              clip: rect(0, 0, 0, 0);
              white-space: nowrap;
              border: 0;
            }
            → これで「見えないけど読み上げられる」状態を作れます。 */}
        </SheetHeader>

        {/* ユーザー情報エリア */}
        <div className="flex items-center gap-5">
          <div>
            <Avatar>
              <AvatarImage src={avatar_url} />
              <AvatarFallback>ユーザー名</AvatarFallback>
              {/* AvatarFallback = AvatarImage の代替表示（ローディング中またはエラー時） */}
            </Avatar>
          </div>
          <div>
            <div>{full_name}</div>
            <div>
              <Link href={"#"} className="text-green-500 text-xs">アカウントを管理する</Link>
            </div>
          </div>
        </div>

        {/* メニューエリア */}
        <ul className="space-y-4">
          <li>
            <Link href={"/orders"} className="flex items-center gap-4">
              <Bookmark fill="bg-primary" />
              <span className="font-bold">ご注文内容</span>
            </Link>
          </li>
          <li>
            <Link href={"#"} className="flex items-center gap-4">
              <Heart fill="bg-primary" />
              <span className="font-bold">お気に入り</span>
            </Link>
          </li>
        </ul>
        <SheetFooter>
          <form>
            <Button formAction={logout} className="w-full">ログアウト</Button>
          </form>
          {/* ✅form + formAction を使うことで、サーバーコンポーネント上でもボタンクリックで関数を実行できる
              Next.js（App Router）では、サーバーコンポーネント内で直接クライアントイベントを使えないため、サーバー側で処理を実行する仕組みとして Server Actions が提供されています
              formAction={logout} のように書くと、ボタンクリック時に サーバー側の logout 関数が呼ばれる 仕組みになります
              旧来の onClick はクライアント側で動くため、サーバーコンポーネントでは使えません
              formAction で呼ぶ関数 = Server Action
　　　　　　　 サーバーコンポーネント内で「ボタンクリックでサーバー処理を実行する公式の方法」です
          */}
          <SheetClose asChild>
            {/* SheetCloseも<button>タグを作成するので asChildで生成させないようにする
            しないと二重に<button>タグが生成されてエラーになる。 */}
            <Button variant="outline">閉じる</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}

export default MenuSheet

