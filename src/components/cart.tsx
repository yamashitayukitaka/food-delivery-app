'use client'
// ✅svwを使う場合はクライアントコンポーネントにする必要がある


import { useCart } from "@/hooks/cart/useCart"
import { computeCartDisplayLogic } from "@/lib/cart/utils";
import CartSheet from "./cart-sheet";
import CartDropDown from "./cart-drop-dpwn";
import { useEffect, useState } from "react";
import type { Cart } from "@/types";
import { useCartVisibility } from "@/app/context/cartContext";
import { useParams } from "next/navigation";

export default function Cart() {
  const [selectedCart, setSelectedCart] = useState<Cart | null>(null);
  const { isOpen, openCart, closeCart } = useCartVisibility();
  const { restaurantId } = useParams<{ restaurantId: string }>();
  console.log('restaurantId', restaurantId);
  const { carts, isLoading, cartsError, targetCart, mutateCart } = useCart(restaurantId);

  const { displayMode, sheetCart, cartCount } = computeCartDisplayLogic(carts, selectedCart, targetCart);
  console.log('carts', carts);

  useEffect(() => {
    if (!carts || !selectedCart) return;
    const updatedCart = carts.find((cart) => cart.id === selectedCart.id) ?? null;
    console.log('updatedCart', updatedCart);
    setSelectedCart(updatedCart);
  }, [carts]);

  useEffect(() => {
    if (isOpen) return;
    setTimeout(() => setSelectedCart(null), 200);

  }, [isOpen]);

  if (cartsError) {
    return <div> {cartsError.message}</div>
  }
  if (isLoading || !carts) {
    return <div>Loading...</div>
  }
  return displayMode === 'cartSheet' ? (
    <CartSheet cart={sheetCart} count={cartCount} isOpen={isOpen} closeCart={closeCart} openCart={openCart} mutateCart={mutateCart} />
  ) : (
    <CartDropDown carts={carts} setSelectedCart={setSelectedCart} openCart={openCart} />
  )
}