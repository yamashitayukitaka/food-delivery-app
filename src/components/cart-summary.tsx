'use client';

import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useCart } from "@/hooks/cart/useCart";
import CartSkeleton from "./cart-skeleton";
import { calculateItemTotal, calculateSubtotal, sumItems } from "@/lib/cart/utils";
import { checkoutAction, updateCartItemAction } from "@/app/(private)/actions/cartAction";
import { useRouter } from "next/navigation";

interface CartSummaryProps {
  restaurantId: string;
}

const CartSummary = ({ restaurantId }: CartSummaryProps) => {
  const { push } = useRouter();
  const { targetCart: cart, isLoading, cartsError, mutateCart } = useCart(restaurantId)
  console.log("checkout_cart:", cart);

  if (cartsError) {
    return <div> {cartsError.message}</div>
  }

  if (isLoading) {
    return <CartSkeleton />
  }

  if (cart == null) {
    return <div>カートが見つかりません</div>
  }

  const fee = 100;
  const service = 0;
  const delivery = 0;
  const subtotal = calculateSubtotal(cart.cart_items);
  const total = fee + service + delivery + subtotal;

  const handleUpdateCartItem = async (value: string, cartItemId: number) => {
    console.log('更新する数量', value);
    console.log('更新するカートアイテムID', cartItemId);
    const quantity = Number(value);
    try {
      await updateCartItemAction(quantity, cartItemId, cart.id);
      const copyCart = { ...cart };

      if (quantity === 0) {
        if (cart.cart_items.length === 1) {

          mutateCart(
            (prevCarts) => prevCarts?.filter((c) => c.id !== cart.id),
            false
          );
          push(`/restaurant/${cart.restaurant_id}`);
          return;
        }
        copyCart.cart_items = copyCart.cart_items.filter((cartItem) => cartItem.id !== cartItemId);
        mutateCart((prevCarts) => prevCarts?.map((cart) => (cart.id === copyCart.id ? copyCart : cart)), false);
      }

      copyCart.cart_items = copyCart.cart_items.map((item) =>
        item.id === cartItemId ? { ...item, quantity: quantity } : item
      );
      mutateCart((prevCarts) => prevCarts?.map((cart) => (cart.id === copyCart.id ? copyCart : cart)), false);

    } catch (error) {
      console.error(error);
      alert('エラーが発生しました')
    }
  }

  const startCheckout = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/checkout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cart_items: cart.cart_items,
        })
      }
      );
      const responseData = await response.json();
      if (responseData) {
        push(responseData.checkout_url)
      }
    } catch {

    }
  }

  const handleCheckout = async () => {
    try {
      await checkoutAction(cart.id, fee, service, delivery);
      await startCheckout();
      mutateCart(
        (prevCarts) => prevCarts?.filter((c) => c.id !== cart.id),
        false
      );
      // push(`/restaurant/${cart.restaurant_id}/checkout/complete`);
    } catch (error) {
      console.error(error);
      alert('エラーが発生しました')
    }
  }
  return (
    <Card className="max-w-md min-w-[420px]">
      <CardHeader>
        <Link href={`/restaurant/${cart.restaurant_id}`} className="mb-4 flex justify-between items-center">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative size-12 rounded-full overflow-hidden flex-none">
              <Image
                src={cart.photoUrl}
                alt={cart.restaurantName ?? "レストラン画像"}
                fill
                className="object-cover w-full h-full"
                sizes="48px"
              />
            </div>
            <div className="font-bold">{cart.restaurantName}</div>
          </div>
          <ChevronRight size={16} />
        </Link>
        <Button className="cursor-pointer" onClick={handleCheckout}>
          本ページの内容を確認の上、注文を確定する
        </Button>
      </CardHeader>
      <CardContent>
        <hr className="my-2" />
        <Accordion type="single" collapsible defaultValue="item-1">
          <AccordionItem value="item-1">
            <AccordionTrigger>カートの中身{sumItems(cart.cart_items)}個の商品</AccordionTrigger>
            {cart.cart_items.map((cartItem) => (
              <AccordionContent key={cartItem.id} className="flex items-center">
                <div className="flex items-center gap-4 flex-1">
                  <div className="relative size-14 rounded-full overflow-hidden flex-none">
                    <Image
                      src={cartItem.menus.photoUrl}
                      alt={cartItem.menus.name}
                      fill
                      sizes="56px"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <div>
                    <div className="font-bold">{cartItem.menus.name}</div>
                    <p className="text-muted-foreground text-sm">￥{calculateItemTotal(cartItem)}</p>
                  </div>
                </div>

                <label htmlFor={`cart-quantity-${cartItem.id}`} className="sr-only">
                  数量
                </label>
                <select
                  id={`cart-quantity-${cartItem.id}`}
                  name="quantity"
                  value={cartItem.quantity}
                  className="border rounded-full pr-8 pl-4 bg-muted h-9"
                  onChange={(e) => { handleUpdateCartItem(e.target.value, cartItem.id) }}
                >
                  <option value="0">削除する</option>
                  <option value="1">1</option>
                  <option value="2">2</option>
                  <option value="3">3</option>
                  <option value="4">4</option>
                  <option value="5">5</option>
                </select>
              </AccordionContent>
            ))}
          </AccordionItem>
        </Accordion>
      </CardContent>
      <CardFooter>
        <div className="w-full">
          <h6 className="font-bold text-xl mb-4">注文の合計額</h6>
          <ul className="grid gap-4">
            <li className="flex justify-between text-muted-foreground">
              <p>小計</p>
              <p>¥{subtotal}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>手数料</p>
              <p>¥ {fee}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>サービス</p>
              <p>¥ {service}</p>
            </li>
            <li className="flex justify-between text-muted-foreground">
              <p>配達</p>
              <p>¥ {delivery}</p>
            </li>
          </ul>
          <hr className="my-2" />
          <div className="flex justify-between font-medium">
            <p>合計</p>
            <p>¥{total}</p>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};

export default CartSummary;
