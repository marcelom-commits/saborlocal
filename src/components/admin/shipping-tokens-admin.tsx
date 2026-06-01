"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

interface Token {
  id: string;
  token: string;
  price: number;
  isUsed: boolean;
  createdAt: string;
}

export function ShippingTokensAdmin() {
  const router = useRouter();
  const [tokens, setTokens] = useState<Token[]>([]);
  const [newPrice, setNewPrice] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetch("/api/admin/shipping-tokens")
      .then((r) => r.json())
      .then(setTokens);
  }, []);

  async function handleGenerate() {
    setGenerating(true);
    await fetch("/api/admin/shipping-tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ price: parseFloat(newPrice) }),
    });
    setNewPrice("");
    setGenerating(false);
    const res = await fetch("/api/admin/shipping-tokens").then((r) => r.json());
    setTokens(res);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
      <h3 className="font-medium text-stone-800 mb-3">Tokens de Frete</h3>
      <div className="flex gap-2 mb-4">
        <input value={newPrice} onChange={(e) => setNewPrice(e.target.value)} type="number" step="0.01" placeholder="Valor do frete" className="flex-1 border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <button onClick={handleGenerate} disabled={generating || !newPrice} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50">
          Gerar
        </button>
      </div>
      <div className="space-y-2 max-h-48 overflow-y-auto">
        {tokens.map((t) => (
          <div key={t.id} className="flex justify-between items-center text-sm py-1.5 border-b border-stone-100 last:border-0">
            <div>
              <code className="text-xs bg-stone-100 px-2 py-0.5 rounded text-stone-600">{t.token.slice(0, 12)}...</code>
              <span className="ml-2 text-stone-500">{formatPrice(Number(t.price))}</span>
            </div>
            <span className={`text-xs ${t.isUsed ? "text-red-500" : "text-green-600"}`}>
              {t.isUsed ? "Usado" : "Disponível"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
