import { requireAdmin } from "@/lib/access";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { PixSettingsAdmin } from "@/components/admin/pix-settings-admin";
import { WhatsAppSettingsAdmin } from "@/components/admin/whatsapp-settings-admin";
import { MercadoPagoSettingsAdmin } from "@/components/admin/mercado-pago-settings-admin";
import { ShippingTokensAdmin } from "@/components/admin/shipping-tokens-admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireAdmin();

  const [orderCount, revenue, customerCount, orders] = await Promise.all([
    prisma.order.count(),
    prisma.order.aggregate({ _sum: { total: true }, where: { status: { not: "CANCELED" } } }),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { items: true } }),
  ]);

  const totalRevenue = revenue._sum.total ? Number(revenue._sum.total) : 0;

  return (
    <div className="space-y-8">
      <h1 className="font-serif text-2xl text-stone-800">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <p className="text-sm text-stone-500">Pedidos</p>
          <p className="text-3xl font-bold text-stone-800 mt-1">{orderCount}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <p className="text-sm text-stone-500">Faturamento</p>
          <p className="text-3xl font-bold text-amber-700 mt-1">{formatPrice(totalRevenue)}</p>
        </div>
        <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
          <p className="text-sm text-stone-500">Clientes</p>
          <p className="text-3xl font-bold text-stone-800 mt-1">{customerCount}</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <PixSettingsAdmin />
        <WhatsAppSettingsAdmin />
        <MercadoPagoSettingsAdmin />
        <ShippingTokensAdmin />
      </div>

      <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
        <h2 className="font-serif text-lg text-stone-800 mb-4">Últimos Pedidos</h2>
        {orders.length === 0 ? (
          <p className="text-sm text-stone-500">Nenhum pedido ainda.</p>
        ) : (
          <div className="space-y-2">
            {orders.map((order) => (
              <div key={order.id} className="flex justify-between text-sm py-2 border-b border-stone-100 last:border-0">
                <span className="text-stone-600">#{order.orderNumber} - {order.items.length} itens</span>
                <span className="font-medium">{formatPrice(Number(order.total))}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
