"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function MercadoPagoSettingsAdmin() {
  const router = useRouter();
  const [token, setToken] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/mercado-pago")
      .then((r) => r.json())
      .then((data) => setToken(data.accessToken || ""));
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings/mercado-pago", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ accessToken: token }),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
      <h3 className="font-medium text-stone-800 mb-3">Mercado Pago</h3>
      <form onSubmit={handleSave} className="space-y-3">
        <input value={token} onChange={(e) => setToken(e.target.value)} placeholder="Access Token" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <button type="submit" disabled={saving} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
