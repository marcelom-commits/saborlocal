import { PixPaymentInfo } from "@/components/store/pix-payment-info";
import { prisma } from "@/lib/prisma";
import { getPixSettings } from "@/lib/store-settings";
import { buildPixBRCode } from "@/lib/pix-brcode";
import { redirect } from "next/navigation";
import Link from "next/link";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function PendentePage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  if (!orderId) {
    redirect("/");
  }

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { payment: true },
  });

  if (!order) {
    redirect("/");
  }

  const pixSettings = await getPixSettings();
  let brCode: string | undefined;

  try {
    brCode = await buildPixBRCode({
      key: pixSettings.pixKey,
      amount: Number(order.total),
      receiver: pixSettings.pixReceiver,
    });
  } catch {}

  return (
    <div className="max-w-lg mx-auto px-4 py-12 text-center">
      <div className="text-5xl mb-4">⏳</div>
      <h1 className="font-serif text-3xl text-stone-800 mb-3">Aguardando pagamento</h1>
      <p className="text-stone-500 mb-6">
        Pedido #{order.orderNumber} - Pague via Pix para confirmar.
      </p>

      <PixPaymentInfo
        pixKey={pixSettings.pixKey}
        pixReceiver={pixSettings.pixReceiver}
        amount={Number(order.total)}
        brCode={brCode}
      />

      <div className="mt-6 space-y-2">
        <a
          href={`/api/payments/mock-callback?orderId=${order.id}`}
          className="block text-sm text-amber-700 hover:underline"
        >
          Simular pagamento (modo demonstração)
        </a>
        <Link
          href="/catalogo"
          className="block text-sm text-stone-500 hover:text-stone-700"
        >
          Continuar comprando
        </Link>
      </div>
    </div>
  );
}
