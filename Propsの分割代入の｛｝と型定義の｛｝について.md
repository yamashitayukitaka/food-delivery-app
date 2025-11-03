✅Propsの分割代入の｛｝と型定義の｛｝について

===================================================================================
export default function Section({children, title }:{ children: React.ReactNode, title: string }) {
※{ children,title }は分割代入の｛｝
★{ children: React.ReactNode, title: string }の｛｝はオブジェクト型を示すTsの型定義
この場合{ children: React.ReactNode, title: string }は分割代入前のPropsとしての状態を定義すれば良い
Propsはオブジェクト型なので{ children: React.ReactNode, title: string }の｛｝はオブジェクト型を示すTsの型定義


より分かりやすく例
export default function Section({ title }: { title: string }) {
✅{ title }はtitleを分割代入するための{}
✅{ title: string }はtitleの型定義を示すための{}でtitleはPropsなのでひとつでもオブジェクト型で定義する必要がある
{ title: string }は{ title }のなかのtitleの中身の型定義を示している外側の{}は表していない
===================================================================================