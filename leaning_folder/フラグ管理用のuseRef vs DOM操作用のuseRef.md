✅useRefの2つの用途
1．再レンダリングを必要としない場面でのbooleanの変更など
2．HTMLにref={}で埋め込んでDOM操作を行う場合


1.に関して
const clickedOnItem = useRef(false);
<CommandItem
onMouseDown={() => clickedOnItem.current = true}
>
などでbooleanを切り替え、処理に使用するだけで
役割としては、useState(boolean)とほぼ同じだが、
再レンダリングを必要としない場合に使用する
useState(boolean)は再レンダリングが起こる
注）このような場合のuseRefにvalueの概念はない

2．に関して
const inputRef = useRef<HTMLInputElement>(null);
<input ref={inputRef} />
と言う形でref={}とした場合にのみ
DOM操作がかのうになり
inputRef.current.valueで埋め込んだHTML要素のアクセスできる。
