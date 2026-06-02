"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Address {
  id: string;
  label: string | null;
  recipientName: string;
  street: string;
  number: string;
  complement: string | null;
  district: string;
  city: string;
  state: string;
  zipCode: string;
  isDefault: boolean;
}

interface Props {
  addresses: Address[];
}

export function AddressesManager({ addresses }: Props) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleDelete(id: string) {
    await fetch(`/api/account/addresses/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <button
        onClick={() => setShowForm(!showForm)}
        className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800"
      >
        {showForm ? "Cancelar" : "Novo endereço"}
      </button>

      {showForm && (
        <AddressForm
          onSave={() => { setShowForm(false); router.refresh(); }}
        />
      )}

      {addresses.map((addr) => (
        <div key={addr.id} className="bg-white rounded-xl p-4 shadow-sm border border-stone-200">
          {editingId === addr.id ? (
            <AddressForm
              address={addr}
              onSave={() => { setEditingId(null); router.refresh(); }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium text-stone-800">{addr.recipientName}</p>
                <p className="text-sm text-stone-500">
                  {addr.street}, {addr.number}
                  {addr.complement && ` - ${addr.complement}`}
                </p>
                <p className="text-sm text-stone-500">
                  {addr.district} - {addr.city}/{addr.state} - {addr.zipCode}
                </p>
                {addr.isDefault && (
                  <span className="text-xs text-amber-700 font-medium">Principal</span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => setEditingId(addr.id)}
                  className="text-xs text-stone-500 hover:text-stone-700"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Remover
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function AddressForm({
  address,
  onSave,
  onCancel,
}: {
  address?: Address;
  onSave: () => void;
  onCancel?: () => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const data = Object.fromEntries(form);

    if (address) {
      await fetch(`/api/account/addresses/${address.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setSaving(false);
    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
      <div className="col-span-2">
        <label className="block text-xs font-medium text-stone-700 mb-1">Nome do recebedor</label>
        <input name="recipientName" defaultValue={address?.recipientName} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div className="col-span-2">
        <label className="block text-xs font-medium text-stone-700 mb-1">Rua</label>
        <input name="street" defaultValue={address?.street} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">Número</label>
        <input name="number" defaultValue={address?.number} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">Complemento</label>
        <input name="complement" defaultValue={address?.complement || ""} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">Bairro</label>
        <input name="district" defaultValue={address?.district} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">Cidade</label>
        <input name="city" defaultValue={address?.city} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">Estado</label>
        <select name="state" defaultValue={address?.state || ""} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="">Selecione</option>
          {["AC","AL","AP","AM","BA","CE","DF","ES","GO","MA","MT","MS","MG","PA","PB","PR","PE","PI","RJ","RN","RS","RO","RR","SC","SP","SE","TO"].map((uf) => (
            <option key={uf} value={uf}>{uf}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-medium text-stone-700 mb-1">CEP</label>
        <input name="zipCode" defaultValue={address?.zipCode} required placeholder="00000000" maxLength={8} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" onChange={(e) => { e.target.value = e.target.value.replace(/\D/g, "").slice(0, 8) }} />
      </div>
      <div className="col-span-2 flex gap-2">
        <button type="submit" disabled={saving} className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800 disabled:opacity-50">
          {saving ? "Salvando..." : "Salvar"}
        </button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-sm text-stone-500 hover:text-stone-700">
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
}
