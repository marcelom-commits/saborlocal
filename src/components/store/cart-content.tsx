"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

interface CartItem {
  id: string;
  quantity: number;
  unitPrice: number;
  product: {
    id: string;
    name: string;
    images: { url: string; alt: string | null }[];
  };
}

interface Props {
  items: CartItem[];
  subtotal: number;
}

export function CartContent({ items, subtotal }: Props) {
  const router = useRouter();

  async function handleUpdateQuantity(itemId: string, delta: number) {
    const item = items.find((i) => i.id === itemId);
    if (!item) return;
    const newQty = item.quantity + delta;
    if (newQty <= 0) {
      await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    } else {
      await fetch(`/api/cart/items/${itemId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quantity: newQty }),
      });
    }
    router.refresh();
  }

  async function handleRemove(itemId: string) {
    await fetch(`/api/cart/items/${itemId}`, { method: "DELETE" });
    router.refresh();
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">🛒</div>
        <h2 className="font-serif text-2xl text-stone-800 mb-2">Seu carrinho está vazio</h2>
        <p className="text-stone-500 mb-6">Explore nosso catálogo e adicione produtos.</p>
        <Link
          href="/catalogo"
          className="inline-block bg-amber-700 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-800"
        >
          Ver catálogo
        </Link>
      </div>
    );
  }

  return (
    <div className="grid lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 bg-white rounded-xl p-4 shadow-sm">
            <div className="w-20 h-20 relative rounded-lg overflow-hidden flex-shrink-0">
              {item.product.images[0] ? (
                <Image
                  src={item.product.images[0].url}
                  alt={item.product.images[0].alt || item.product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-stone-100 flex items-center justify-center text-stone-300 text-xs">
                  Sem img
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-stone-800 truncate">{item.product.name}</h3>
              <p className="text-sm text-stone-500 mt-1">{formatPrice(item.unitPrice)}</p>
              <div className="flex items-center gap-3 mt-2">
                <div className="flex items-center border border-stone-200 rounded-lg">
                  <button
                    onClick={() => handleUpdateQuantity(item.id, -1)}
                    className="px-3 py-1 text-stone-600 hover:text-stone-800"
                  >
                    −
                  </button>
                  <span className="px-3 py-1 text-sm font-medium border-x border-stone-200">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => handleUpdateQuantity(item.id, 1)}
                    className="px-3 py-1 text-stone-600 hover:text-stone-800"
                  >
                    +
                  </button>
                </div>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            </div>
            <div className="text-right flex-shrink-0">
              <p className="font-medium text-stone-800">
                {formatPrice(Number(item.unitPrice) * item.quantity)}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl p-6 shadow-sm h-fit sticky top-24">
        <h3 className="font-serif text-lg text-stone-800 mb-4">Resumo</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-stone-600">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between text-stone-600">
            <span>Frete</span>
            <span>Calculado no checkout</span>
          </div>
          <div className="border-t border-stone-200 pt-2 flex justify-between font-medium text-stone-800">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
        </div>
        <Link
          href="/checkout"
          className="mt-6 block w-full bg-amber-700 text-white text-center px-6 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
        >
          Finalizar pedido
        </Link>
      </div>
    </div>
  );
}
