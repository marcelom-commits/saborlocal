"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/format";

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  category: { id: string; name: string };
  images: { url: string }[];
  variants: any[];
}

interface Category {
  id: string;
  name: string;
}

export function ProductsAdmin({ products, categories }: { products: Product[]; categories: Category[] }) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  async function handleToggleActive(id: string, isActive: boolean) {
    await fetch(`/api/admin/products/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    router.refresh();
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-stone-800">Produtos</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-amber-700 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-amber-800"
        >
          {showForm ? "Cancelar" : "Novo produto"}
        </button>
      </div>

      {showForm && (
        <ProductForm
          categories={categories}
          onSave={() => { setShowForm(false); router.refresh(); }}
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Produto</th>
              <th className="text-left px-4 py-3 font-medium">Categoria</th>
              <th className="text-right px-4 py-3 font-medium">Preço</th>
              <th className="text-right px-4 py-3 font-medium">Estoque</th>
              <th className="text-center px-4 py-3 font-medium">Ativo</th>
              <th className="text-center px-4 py-3 font-medium">Destaque</th>
              <th className="text-right px-4 py-3 font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">{product.name}</td>
                <td className="px-4 py-3 text-stone-500">{product.category.name}</td>
                <td className="px-4 py-3 text-right">{formatPrice(Number(product.price))}</td>
                <td className="px-4 py-3 text-right">{product.stock}</td>
                <td className="px-4 py-3 text-center">
                  <button
                    onClick={() => handleToggleActive(product.id, product.isActive)}
                    className={`text-xs px-2 py-1 rounded-full ${
                      product.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
                    }`}
                  >
                    {product.isActive ? "Sim" : "Não"}
                  </button>
                </td>
                <td className="px-4 py-3 text-center">
                  {product.isFeatured && <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">Destaque</span>}
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => setEditingId(editingId === product.id ? null : product.id)}
                    className="text-xs text-amber-700 hover:underline"
                  >
                    {editingId === product.id ? "Fechar" : "Editar"}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editingId && (
        <div className="mt-4">
          <ProductForm
            product={products.find((p) => p.id === editingId)}
            categories={categories}
            onSave={() => { setEditingId(null); router.refresh(); }}
            onCancel={() => setEditingId(null)}
          />
        </div>
      )}
    </div>
  );
}

function ProductForm({
  product,
  categories,
  onSave,
  onCancel,
}: {
  product?: Product;
  categories: Category[];
  onSave: () => void;
  onCancel?: () => void;
}) {
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const form = new FormData(e.currentTarget);
    const data: any = Object.fromEntries(form);
    data.price = parseFloat(data.price);
    data.stock = parseInt(data.stock);
    data.isActive = data.isActive === "on";
    data.isFeatured = data.isFeatured === "on";

    if (product) {
      await fetch(`/api/admin/products/${product.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
    } else {
      await fetch("/api/admin/products", {
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
      <h3 className="font-serif text-lg text-stone-800">{product ? "Editar" : "Novo"} Produto</h3>
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block text-xs font-medium text-stone-700 mb-1">Nome</label>
          <input name="name" defaultValue={product?.name} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="col-span-2">
          <label className="block text-xs font-medium text-stone-700 mb-1">Descrição</label>
          <textarea name="description" defaultValue={product?.description || ""} className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" rows={3} />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">Categoria</label>
          <select name="categoryId" defaultValue={product?.category?.id || categories[0]?.id} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">Preço</label>
          <input name="price" type="number" step="0.01" defaultValue={product ? Number(product.price) : ""} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-xs font-medium text-stone-700 mb-1">Estoque</label>
          <input name="stock" type="number" defaultValue={product?.stock || 0} required className="w-full border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="flex items-center gap-4 pt-5">
          <label className="flex items-center gap-2 text-sm">
            <input name="isActive" type="checkbox" defaultChecked={product ? product.isActive : true} />
            Ativo
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input name="isFeatured" type="checkbox" defaultChecked={product?.isFeatured || false} />
            Destaque
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
