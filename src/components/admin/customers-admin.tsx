"use client";

import { useState } from "react";

interface Customer {
  id: string;
  name: string | null;
  email: string;
  createdAt: string;
  customerProfile: {
    phone: string | null;
    _count: { orders: number };
  } | null;
}

export function CustomersAdmin({ customers }: { customers: Customer[] }) {
  const [search, setSearch] = useState("");

  const filtered = customers.filter(
    (c) =>
      c.name?.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-2xl text-stone-800">Clientes</h1>
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar cliente..."
          className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 w-64"
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-stone-50 text-stone-600">
            <tr>
              <th className="text-left px-4 py-3 font-medium">Nome</th>
              <th className="text-left px-4 py-3 font-medium">Email</th>
              <th className="text-left px-4 py-3 font-medium">Telefone</th>
              <th className="text-center px-4 py-3 font-medium">Pedidos</th>
              <th className="text-right px-4 py-3 font-medium">Desde</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filtered.map((customer) => (
              <tr key={customer.id} className="hover:bg-stone-50">
                <td className="px-4 py-3 font-medium text-stone-800">{customer.name || "—"}</td>
                <td className="px-4 py-3 text-stone-500">{customer.email}</td>
                <td className="px-4 py-3 text-stone-500">{customer.customerProfile?.phone || "—"}</td>
                <td className="px-4 py-3 text-center">{customer.customerProfile?._count.orders || 0}</td>
                <td className="px-4 py-3 text-right text-stone-500">
                  {new Date(customer.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
