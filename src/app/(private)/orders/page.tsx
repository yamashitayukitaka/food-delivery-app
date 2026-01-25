import OrderCard from "@/components/order-card";
import { fetchOrders } from "@/lib/orders/api";

export default async function OrdersPage() {
  const orders = await fetchOrders();
  console.log('orders', orders)
  if (orders.length === 0) {
    return <div>過去の注文がありません</div>
  }
  return (
    <div className="space-y-4">
      {orders.map((order) => (
        <OrderCard key={order.id} order={order} />
      ))}
    </div>
  );
}