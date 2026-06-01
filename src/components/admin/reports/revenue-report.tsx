"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/format";

export function RevenueReport() {
  const [startDate, setStartDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() - 30);
    return d.toISOString().split("T")[0];
  });
  const [endDate, setEndDate] = useState(() => new Date().toISOString().split("T")[0]);
  const [data, setData] = useState<any[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetch(`/api/admin/reports/revenue?start=${startDate}&end=${endDate}`)
      .then((r) => r.json())
      .then((res) => {
        setData(res.data || []);
        setTotal(res.total || 0);
      });
  }, [startDate, endDate]);

  function handleExportCSV() {
    const headers = "Data, Pedidos, Receita\n";
    const rows = data.map((r: any) => `${r.date},${r.orders},${r.revenue}`);
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio-faturamento-${startDate}-${endDate}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
      <div className="flex items-center gap-4 mb-6">
        <div>
          <label className="block text-xs text-stone-500 mb-1">De</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div>
          <label className="block text-xs text-stone-500 mb-1">Até</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="border border-stone-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
        </div>
        <div className="pt-4 flex gap-2">
          <button onClick={handleExportCSV} className="border border-stone-300 text-stone-600 px-3 py-2 rounded-lg text-sm hover:bg-stone-50">Exportar CSV</button>
          <button onClick={handlePrint} className="border border-stone-300 text-stone-600 px-3 py-2 rounded-lg text-sm hover:bg-stone-50">Imprimir</button>
        </div>
      </div>

      <div className="text-center mb-6">
        <p className="text-sm text-stone-500">Receita total do período</p>
        <p className="text-3xl font-bold text-amber-700">{formatPrice(total)}</p>
      </div>

      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-stone-600">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Data</th>
            <th className="text-right px-4 py-3 font-medium">Pedidos</th>
            <th className="text-right px-4 py-3 font-medium">Receita</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {data.map((row: any, i: number) => (
            <tr key={i}>
              <td className="px-4 py-3">{row.date}</td>
              <td className="px-4 py-3 text-right">{row.orders}</td>
              <td className="px-4 py-3 text-right">{formatPrice(row.revenue)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
