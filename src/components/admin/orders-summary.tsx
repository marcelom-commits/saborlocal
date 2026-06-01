"use client";

import { useState, useEffect } from "react";

export function OrdersSummary() {
  const [period, setPeriod] = useState("today");
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/admin/orders/summary?period=${period}`)
      .then((r) => r.json())
      .then(setData);
  }, [period]);

  return (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-stone-200">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-medium text-stone-800">Resumo de Pedidos</h2>
        <select value={period} onChange={(e) => setPeriod(e.target.value)} className="text-sm border border-stone-300 rounded-lg px-3 py-1.5 bg-white focus:outline-none focus:ring-2 focus:ring-amber-500">
          <option value="today">Hoje</option>
          <option value="week">Esta semana</option>
          <option value="month">Este mês</option>
          <option value="all">Todo período</option>
        </select>
      </div>
      {data ? (
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 text-center text-sm">
          {[
            { key: "total", label: "Total", color: "text-stone-800" },
            { key: "paid", label: "Pagos", color: "text-green-600" },
            { key: "shipped", label: "Enviados", color: "text-blue-600" },
            { key: "delivered", label: "Entregues", color: "text-amber-600" },
            { key: "pending", label: "Pendentes", color: "text-yellow-600" },
            { key: "canceled", label: "Cancelados", color: "text-red-600" },
          ].map(({ key, label, color }) => (
            <div key={key}>
              <p className={`font-bold ${color}`}>{data[key] || 0}</p>
              <p className="text-stone-500 text-xs">{label}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-stone-500 text-center">Carregando...</p>
      )}
    </div>
  );
}
