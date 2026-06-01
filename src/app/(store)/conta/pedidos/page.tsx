import { requireUser } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { formatOrderNumber, formatPrice, orderStatusLabels } from "@/lib/format";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function PedidosPage() {
  const user = await requireUser();
  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true },
  });

  return (
    <div>
      <h2 className="font-serif text-2xl text-stone-800 mb-4">Meus Pedidos</h2>
      {orders.length === 0 ? (
        <p className="text-stone-500">Nenhum pedido ainda.</p>
      ) : (
        <div className="space-y-3">
          {orders.map((order) => (
            <Link
              key={order.id}
              href={`/conta/pedidos/${order.id}`}
              className="block bg-white rounded-xl p-4 shadow-sm border border-stone-200 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium text-stone-800">
                    Pedido {formatOrderNumber(order.orderNumber)}
                  </p>
                  <p className="text-sm text-stone-500">
                    {order.items.length} itens - {formatPrice(Number(order.total))}
                  </p>
                </div>
                <span className="text-xs font-medium px-2 py-1 rounded-full bg-stone-100 text-stone-600">
                  {orderStatusLabels[order.status] || order.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
