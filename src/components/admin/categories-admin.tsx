"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
}

export function CategoriesAdmin({ categories }: { categories: Category[] }) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-stone-800">Categorias</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800"
        >
          {showForm ? "Cancelar" : "Nova categoria"}
        </button>
      </div>

      {showForm && (
        <CategoryForm onSave={() => { setShowForm(false); router.refresh(); }} />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">Slug</th>
              <th className="text-center px-4 py-3 font-medium">Produtos</th>
              <th className="text-center px-4 py-3 font-medium">Ativo</th>
              <th className="text-center px-4 py-3 font-medium">Ordem</th>
              <th className="text-right px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {categories.map((cat) => (
              <tr key={cat.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">{cat.name}</td>
                <td className="px-4 py-3 text-stone-500">{cat.slug}</td>
                <td className="px-4 py-3 text-center">{cat._count.products}</td>
                <td className="px-4 py-3 text-center">
                  <span className={`text-xs px-2 py-1 rounded-full ${cat.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
                    {cat.isActive ? "Sim" : "Não"}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">{cat.sortOrder}</td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditingId(editingId === cat.id ? null : cat.id)}
                    className="text-xs text-amber-700 hover:underline"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="mt-4">
          <CategoryForm
            category={categories.find((c) => c.id === editingId)}
            onSave={() => { setEditingId(null); router.refresh(); }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}
    </div>
  );
}

function CategoryForm({
  category,
  onSave,
  onCancel,
}: {
  category?: Category;
  onSave: () => void;
  onCancel?: () => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const raw = Object.fromEntries(form);
    const data = {
      name: String(raw.name ?? ""),
      description: String(raw.description ?? ""),
      sortOrder: Number(raw.sortOrder) || 0,
      isActive: raw.isActive === "on",
    };

    if (category) {
      await fetch(`/api/admin/categories/${category.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    }
    setSaving(false);
    onSave();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-6 shadow-sm border border-stone-200 space-y-4 mb-6">
      <h3 className="font-serif text-lg text-stone-800">{category ? "Editar" : "Nova"} Categoria</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">Nome</label>
          <input name="name" defaultValue={category?.name} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">Ordem</label>
          <input name="sortOrder" type="number" defaultValue={category?.sortOrder || 0} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-stone-700 mb-1">Descrição</label>
          <textarea name="description" defaultValue={category?.description || ""} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" rows={2} />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={category ? category.isActive : true} />
            Ativo
          </label>
        </div>
      </div>
      <div className="flex gap-2">
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
