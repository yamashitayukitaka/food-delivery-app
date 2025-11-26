<!-- 
URL の形式	                      例	                       　Next.js が渡すprops 名                          
クエリパラメータ（?key=value）	　　/search?category=ramen	    searchParams
動的セグメント （/[id]）	　　　　　/search/123	                 params 
-->



✅search?category=ramenでURLを形成している場合は searchParamsで受け取り 動的セグメント (例: /search/[id])で受け取る場合はparamsで受け取るということ

注）useSearchParams()を使ってURLを形成していることとsearchParamsというprpps名でURLのデータを取得することは関係ない。Next.jsがクエリパラメータを使っての遷移先でURLからデータを受け取る場合はsearchParamsという
prpps名を用意しているということ

要するにuseSearchParams()を使わないで、クエリパラメータのURLをつくっても 遷移先でpropsとしてデータを受け取る場合はsearchParamsというprops名になる
useSearchParams() を使ったかどうかは一切関係ない。