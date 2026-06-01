"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export function WhatsAppSettingsAdmin() {
  const router = useRouter();
  const [settings, setSettings] = useState({ phone: "", message: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings/whatsapp")
      .then((r) => r.json())
      .then(setSettings);
  }, []);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/admin/settings/whatsapp", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    router.refresh();
  }

  const whatsappLink = `https://wa.me/${settings.phone.replace(/\D/g, "")}?text=${encodeURIComponent(settings.message)}`;

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
      <h3 className="font-medium text-stone-800 mb-3">WhatsApp</h3>
      <form onSubmit={handleSave} className="space-y-3">
        <input value={settings.phone} onChange={(e) => setSettings({ ...settings, phone: e.target.value })} placeholder="Número (código + número)" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        <textarea value={settings.message} onChange={(e) => setSettings({ ...settings, message: e.target.value })} placeholder="Mensagem padrão" className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" rows={2} />
        <button type="submit" disabled={saving} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar"}
        </button>
        {settings.phone && (
          <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block text-xs text-amber-700 hover:underline">
            Testar link do WhatsApp
          </a>
        )}
      </form>
    </div>
  );
}
