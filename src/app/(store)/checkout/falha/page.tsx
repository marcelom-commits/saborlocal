import Link from "next/link";

export default function FalhaPage() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="text-5xl mb-4">❌</div>
      <h1 className="font-serif text-3xl text-stone-800 mb-3">Falha no pagamento</h1>
      <p className="text-stone-500 mb-6">
        Não foi possível processar seu pagamento. Tente novamente.
      </p>
      <Link
        href="/checkout"
        className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800"
      >
        Tentar novamente
      </Link>
    </div>
  );
}
