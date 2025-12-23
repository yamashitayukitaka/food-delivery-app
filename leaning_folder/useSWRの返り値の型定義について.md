  const { data, error, isLoading: loading }: { data: AddressResponse | null; error: any; isLoading: boolean } = useSWR(`/api/address`, fetcher)

✅{ data, error, isLoading: loading }の{}は分割代入の｛｝ 
{ data: AddressResponse | null; error: any; isLoading: boolean } 
{}はオブジェクトの型定義を表すので 
分割代入され前の返り値の状態を型定義するという理解であってるか

{ data, error, isLoading: loading }は分割代入
{ data: AddressResponse | null; error: any; isLoading: boolean }は返り値の型定義なので
根本的に全然違う

{ data, error, isLoading: loading }の分割代入の状態を型定義しているわけではなく
useSWRの返り値の型定義なので根本的に両者は無関係


★Propsの分割代入と型定義の考え方と同じ