"use client";

import { useState } from "react";

interface Props {
  pixKey: string;
  pixReceiver: string;
  amount: number;
  brCode?: string;
}

export function PixPaymentInfo({ pixKey, pixReceiver, amount, brCode }: Props) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (brCode) {
      await navigator.clipboard.writeText(brCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 3000);
    }
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
      <h3 className="font-serif text-lg text-stone-800 mb-4">Pagamento via Pix</h3>
      <div className="space-y-3 text-sm">
        <div className="flex justify-between">
          <span className="text-stone-500">Chave Pix:</span>
          <span className="font-medium text-stone-800">{pixKey}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-stone-500">Recebedor:</span>
          <span className="font-medium text-stone-800">{pixReceiver}</span>
        </div>
        <div className="flex justify-between text-lg font-bold text-amber-700 border-t border-stone-200 pt-3">
          <span>Valor:</span>
          <span>
            {amount.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })}
          </span>
        </div>
      </div>
      {brCode && (
        <div className="mt-4">
          <button
            onClick={handleCopy}
            className="w-full bg-amber-700 text-white px-4 py-3 rounded-lg font-medium hover:bg-amber-800 transition-colors"
          >
            {copied ? "Código copiado!" : "Copiar código Pix"}
          </button>
        </div>
      )}
    </div>
  );
}
