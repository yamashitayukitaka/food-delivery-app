interface SectionProps{ 
  children: React.ReactNode 
  title: string
} 

✅export default function Section({ children, title }: SectionProps) の場合{ children, title }は分割代入後を表しているが 
Propsを引数をに取る場合に限っては分割代入する前のPropsの内部の状態を型定義すれば良い

1️⃣ ({ children, title }: SectionProps) の意味
export default function Section({ children, title }: SectionProps) { ... }
・左側の { children, title }は分割代入（Destructuring）
・props.children や props.title を直接取り出して使えるようにしている

: SectionProps
・その型定義（この場合のの型定義は分割代入する前のPropsの状態を表せばよい）
・「この分割代入される値（props）は SectionProps 型である」と宣言


2️⃣ 型定義のタイミング
関数コンポーネントは常に Props オブジェクト を引数に取る
つまり 分割代入前の props の形 を型定義すれば OK
--------------------------------------------------------------
★例

interface SectionProps {
  children: React.ReactNode;
  title: string;
}

// 分割代入前
function Section(props: SectionProps) {
  const { children, title } = props; // JS の分割代入
}
※どちらでも型の定義対象は Props オブジェクト全体 であり、分割代入前の内部の状態を型定義すれば十分

// 分割代入後
function Section({ children, title }: SectionProps) { ... }
※どちらでも型の定義対象は Props オブジェクト全体 であり、分割代入前の内部の状態を型定義すれば十分

--------------------------------------------------------------

🔹 ポイント
分割代入の {} と型定義の {} は別物
型定義は Props オブジェクト全体の型 を意識すれば OK
