"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function PixSettingsAdmin() {
  const router = useRouter();
  const [settings, setSettings] = useState({ pixKey: "", pixKeyType: "telefone", pixReceiver: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/pix")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings/pix", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
      <h3 className="font-medium text-stone-800 mb-3">Configuração Pix</h3>
      <form onSubmit={handleSave} className="space-y-3">
        <input value={settings.pixKey} onChange={(e) => setSettings({ ...settings, pixKey: e.target.value })} placeholder="Chave Pix" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <input value={settings.pixReceiver} onChange={(e) => setSettings({ ...settings, pixReceiver: e.target.value })} placeholder="Nome do recebedor" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <button type="submit" disabled={saving} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar"}
        </button>
      </form>
    </div>
  );
}
