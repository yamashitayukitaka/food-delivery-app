// 🔹 React の children とは
// children は特殊な Props
// 親コンポーネントのタグ内に挟まれた要素を、子コンポーネントで受け取るための仕組みです。

import TextToggleButton from "./text-toggle-button"



// // 親コンポーネント
// <MyComponent>
//   <p>この内容が children になります</p>
// </MyComponent>

// // 子コンポーネント
// const MyComponent = (props) => {
//   return <div>{props.children}</div>;
// };
// 上記の例では <p>この内容が children になります</p> が props.children として渡されます。

// ✅分割代入では下記のように書く
// const MyComponent = ({ children }) => <div>{children}</div>;
// ※受け取る側は必ず children という名前で受け取る

interface SectionProps {
  children: React.ReactNode
  title: string
}
// ✅React.ReactNode = React がレンダリング可能な要素全ての型
// JSX、文字列、数値、配列、null/undefined も含む


// ✅useStateの型定義は<>型で行う
// 例
// const [count, setCount] = useState<number>(0); // 数値型
// const [name, setName] = useState<string>(""); // 文字列型
// const [isOpen, setIsOpen] = useState<boolean>(false); // 真偽値型

export default function Section({ children, title }: SectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between py-4">
        <h2 className="text-2xl font-bold">{title}</h2>
        <TextToggleButton />
      </div>
      {children}
    </section>
  )
}

