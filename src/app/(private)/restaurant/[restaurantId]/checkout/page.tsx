import CartSummary from "@/components/cart-summary";
import PaymentModal from "@/components/payment-modal";
import AddressModal from "@/components/ui/address-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Banknote, Briefcase } from "lucide-react";

export default async function CheckoutPage({ params }: {
  params: Promise<{ restaurantId: string }>;
}) {
  const { restaurantId } = await params;
  return (
    <div className="flex gap-4  p-10">
      {/* 左側エリア */}
      <div className="max-w-3xl space-y-4 flex-1">
        <Card>
          <CardHeader>
            <CardTitle>配達の詳細</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <Briefcase />
              <AddressModal />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>お支払い</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="flex items-center gap-4">
              <Banknote />
              <PaymentModal />
            </div>
          </CardContent>
        </Card>
      </div>
      {/* 右側エリア */}
      <CartSummary restaurantId={restaurantId} />
    </div>

  );
}
