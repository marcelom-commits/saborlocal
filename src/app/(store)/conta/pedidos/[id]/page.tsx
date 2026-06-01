import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { formatOrderNumber, formatPrice, orderStatusLabels, paymentStatusLabels } from "@/lib/format";
import { getPixSettings } from "@/lib/store-settings";
import { PixPaymentInfo } from "@/components/store/pix-payment-info";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PedidoDetailPage({ params }: Props) {
  const user = await requireUser();
  const { id } = await params;

  const order = await prisma.order.findFirst({
    where: { id, userId: user.id },
    include: { items: true, payment: true },
  });

  if (!order) notFound();

  const pixSettings = await getPixSettings();

  return (
    <div>
      <h2 className="font-serif text-2xl text-stone-800 mb-4">
        Pedido {formatOrderNumber(order.orderNumber)}
      </h2>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 space-y-4">
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Status</span>
          <span className="font-medium">{orderStatusLabels[order.status] || order.status}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-stone-500">Pagamento</span>
          <span className="font-medium">{paymentStatusLabels[order.payment?.status || "PENDING"]}</span>
        </div>

        <div className="border-t border-stone-200 pt-4">
          <h3 className="font-medium text-stone-800 mb-2">Itens</h3>
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm py-1">
              <span className="text-stone-600">{item.productName} x{item.quantity}</span>
              <span>{formatPrice(Number(item.totalPrice))}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-stone-200 pt-4 space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatPrice(Number(order.subtotal))}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Frete</span>
            <span>{formatPrice(Number(order.shippingCost))}</span>
          </div>
          <div className="flex justify-between font-bold text-stone-800">
            <span>Total</span>
            <span>{formatPrice(Number(order.total))}</span>
          </div>
        </div>

        {order.status === "PENDING" && order.payment?.method === "pix" && (
          <div className="border-t border-stone-200 pt-4">
            <PixPaymentInfo
              pixKey={pixSettings.pixKey}
              pixReceiver={pixSettings.pixReceiver}
              amount={Number(order.total)}
            />
          </div>
        )}
      </div>
    </div>
  );
}
