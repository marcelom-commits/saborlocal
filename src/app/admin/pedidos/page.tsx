import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { OrdersSummary } from "@/components/admin/orders-summary";
import { OrdersAdmin } from "@/components/admin/orders-admin";

export const dynamic = "force-dynamic";

export default async function AdminPedidosPage() {
  await requireAdmin();
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { items: true, payment: true, shipment: true, user: true },
  });

  return (
    <div className="space-y-6">
      <h1 className="font-serif text-2xl text-stone-800">Pedidos</h1>
      <OrdersSummary />
      <OrdersAdmin orders={orders as any} />
    </div>
  );
}
