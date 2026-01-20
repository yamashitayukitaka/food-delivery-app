import { Cart, CartItem } from "@/types";

const sumItems = (carts: Cart) => carts.cart_items.reduce((sum, item) => sum + item.quantity, 0)


export function computeCartDisplayLogic(carts: Cart[] | undefined, selectedCart: Cart | null, targetCart: Cart | null) {
  // ✅可読性の観点からネストが深くなるので三項演算子を使わないで条件分岐した
  if (!carts || carts.length === 0) {
    return { displayMode: 'cartSheet', sheetCart: null, cartCount: 0 };
  }

  if (carts.length === 1) {
    const only = carts[0];
    return { displayMode: 'cartSheet', sheetCart: only, cartCount: sumItems(only) };
  }

  // 選択されたカートがある場合
  if (selectedCart) {
    return { displayMode: 'cartSheet', sheetCart: selectedCart, cartCount: sumItems(selectedCart) };
  }

  // ターゲットカートがある場合
  if (targetCart) {
    return { displayMode: 'cartSheet', sheetCart: targetCart, cartCount: sumItems(targetCart) };
  }



  return { displayMode: 'cartDropDown', sheetCart: null, cartCount: 0 }

}