"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  name: string | null;
  email: string;
  phone: string | null;
}

export function ProfileForm({ name, email, phone }: Props) {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const form = new FormData(e.currentTarget);
    const res = await fetch("/api/account/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.get("name") as string,
        phone: form.get("phone") as string,
      }),
    });

    if (res.ok) {
      setMessage("Perfil atualizado!");
      router.refresh();
    } else {
      setMessage("Erro ao atualizar");
    }
    setSaving(false);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div className="text-sm text-amber-700 bg-amber-50 px-4 py-2 rounded-lg">{message}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nome</label>
        <input
          name="name"
          defaultValue={name || ""}
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Email</label>
        <input
          value={email}
          disabled
          className="w-full border border-stone-200 rounded-lg px-4 py-2.5 bg-stone-50 text-stone-500"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Telefone</label>
        <input
          name="phone"
          defaultValue={phone || ""}
          className="w-full border border-stone-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-amber-500"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="bg-amber-700 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-amber-800 disabled:opacity-50 transition-colors"
      >
        {saving ? "Salvando..." : "Salvar"}
      </button>
    </form>
  );
}
