"use client";

import { useRouter } from "next/navigation";

interface Props {
  productId: string;
  price: number;
}

export function AddToCartButton({ productId, price }: Props) {
  const router = useRouter();

  async function handleAdd() {
    await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, quantity: 1, unitPrice: price }),
    });
    router.push("/carrinho");
    router.refresh();
  }

  return (
    <button
      onClick={handleAdd}
      className="text-sm font-medium bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
    >
      Adicionar
    </button>
  );
}
