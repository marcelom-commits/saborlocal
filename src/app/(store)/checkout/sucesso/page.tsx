import Link from "next/link";

interface Props {
  searchParams: Promise<{ orderId?: string }>;
}

export default async function SucessoPage({ searchParams }: Props) {
  const { orderId } = await searchParams;

  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">✅</div>
      <h1 className="font-serif text-3xl text-stone-800 mb-3">Pedido confirmado!</h1>
      <p className="text-stone-500 mb-6">
        Seu pedido foi processado com sucesso.
        {orderId && <span className="block text-sm mt-1">Código: <strong>{orderId}</strong></span>}
      </p>
      <Link
        href="/catalogo"
        className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800"
      >
        Continuar comprando
      </Link>
    </div>
  );
}
