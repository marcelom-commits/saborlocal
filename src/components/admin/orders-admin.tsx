"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatOrderNumber, formatPrice, orderStatusLabels } from "@/lib/format";

interface Order {
  id: string;
  orderNumber: number;
  status: string;
  total: number;
  createdAt: string;
  user: { name: string | null; email: string } | null;
  items: { productName: string; quantity: number; totalPrice: number }[];
  payment: { method: string | null; status: string } | null;
}

export function OrdersAdmin({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = statusFilter
    ? orders.filter((o) => o.status === statusFilter)
    : orders;

  async function handleStatusUpdate(orderId: string, status: string) {
    await fetch(`/api/admin/orders/${orderId}/status`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    router.refresh();
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-stone-200 overflow-hidden">
      <div className="p-4 border-b border-stone-200 flex gap-2 flex-wrap">
        <button onClick={() => setStatusFilter("")} className={`text-xs px-3 py-1.5 rounded-full ${!statusFilter ? "bg-amber-700 text-white" : "bg-stone-100 text-stone-600"}`}>Todos</button>
        {Object.entries(orderStatusLabels).map(([key, label]) => (
          <button key={key} onClick={() => setStatusFilter(key)} className={`text-xs px-3 py-1.5 rounded-full ${statusFilter === key ? "bg-amber-700 text-white" : "bg-stone-100 text-stone-600"}`}>
            {label}
          </button>
        ))}
      </div>

      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-stone-600">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Pedido</th>
            <th className="text-left px-4 py-3 font-medium">Cliente</th>
            <th className="text-right px-4 py-3 font-medium">Total</th>
            <th className="text-center px-4 py-3 font-medium">Status</th>
            <th className="text-right px-4 py-3 font-medium">Data</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {filtered.map((order) => (
            <>
              <tr key={order.id} className="hover:bg-stone-50 cursor-pointer" onClick={() => setExpandedId(expandedId === order.id ? null : order.id)}>
                <td className="px-4 py-3 font-medium text-stone-800">{formatOrderNumber(order.orderNumber)}</td>
                <td className="px-4 py-3 text-stone-500">{order.user?.name || order.user?.email || "—"}</td>
                <td className="px-4 py-3 text-right">{formatPrice(Number(order.total))}</td>
                <td className="px-4 py-3 text-center">
                  <select
                    value={order.status}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                    className="text-xs border border-stone-300 rounded-lg px-2 py-1 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {Object.entries(orderStatusLabels).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 text-right text-stone-500">
                  {new Date(order.createdAt).toLocaleDateString("pt-BR")}
                </td>
              </tr>
              {expandedId === order.id && (
                <tr key={`${order.id}-details`}>
                  <td colSpan={5} className="px-4 py-3 bg-stone-50">
                    <div className="text-sm space-y-1">
                      <p className="font-medium text-stone-800 mb-2">Itens</p>
                      {order.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-stone-600">
                          <span>{item.productName} x{item.quantity}</span>
                          <span>{formatPrice(Number(item.totalPrice))}</span>
                        </div>
                      ))}
                      {order.payment && (
                        <div className="border-t border-stone-200 pt-2 mt-2">
                          <p className="text-stone-500">Pagamento: {order.payment.method || "—"} / Status: {order.payment.status}</p>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </>
          ))}
        </tbody>
      </table>
    </div>
  );
}
