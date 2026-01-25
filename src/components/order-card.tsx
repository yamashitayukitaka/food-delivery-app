import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { calculateSubtotal } from "@/lib/cart/utils";
import { Order } from "@/types";
import Image from "next/image";
import Link from "next/link";

interface OrderCardProps {
  order: Order
}

export default function OrderCard({ order }: OrderCardProps) {
  return (
    <>
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="relative size-16 rounded-full overflow-hidden flex-none">
              <Image
                src={order.photoUrl}
                alt={order.restaurantName}
                fill
                className="object-cover w-full h-full"
                sizes="64px"
              />
            </div>
            <div>
              <CardDescription>{new Date(order.created_at).toLocaleDateString()}</CardDescription>
              <CardTitle>{order.restaurantName}</CardTitle>
            </div>
          </div>
          <Button asChild variant="outline">
            <Link href={`/restaurant/${order.restaurant_id}`}>店舗情報を表示</Link>
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {order.order_items.map((item) => (
            <div key={item.id} className="flex items-center justify-between border-b pb-4 last:border-b-0">
              <div className="flex items-center gap-4">
                <div className="relative size-16 rounded-md overflow-hidden flex-none">
                  <Image
                    src={item.photoUrl}
                    alt={item.name}
                    fill
                    className="object-cover w-full h-full"
                    sizes="64px"
                  />
                </div>
                <div>
                  <div className="font-medium">{item.name}</div>
                  <div className="text-muted-foreground">{item.price.toLocaleString()}</div>
                </div>
              </div>
              <div className="text-right">
                <div>{item.quantity}</div>
                <div>¥{item.price}</div>
              </div>
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex flex-col gap-1">
          <div className="w-full border-t pt-4 space-y-1 text-sm text-muted-foreground">
            <div className="flex justify-between">
              <span>小計</span>
              <span>¥{order.subtotal_price}</span>
            </div>
            {order.fee > 0 && (
              <div className="flex justify-between">
                <span>手数料</span>
                <span>¥{order.fee}</span>
              </div>
            )}

            {order.service > 0 && (
              <div className="flex justify-between">
                <span>サービス</span>
                <span>¥{order.service}</span>
              </div>
            )}

            {order.delivery > 0 && (
              <div className="flex justify-between">
                <span>サービス</span>
                <span>¥{order.delivery}</span>
              </div>
            )}
          </div>
          <div className="flex justify-between w-full font-bold pt-2">
            <span>合計</span>
            <span>¥{order.total_price}</span>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
