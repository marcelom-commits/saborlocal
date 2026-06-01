"use client";

import { useState, useEffect } from "react";
import { formatPrice } from "@/lib/format";

export function StockReport() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/admin/reports/stock")
      .then((r) => r.json())
      .then((res) => setData(res.data || []));
  }, []);

  function handleExportCSV() {
    const headers = "Produto, SKU, Estoque, Preço\n";
    const rows = data.map((r: any) => `"${r.name}","${r.sku || ""}",${r.stock},${r.price}`);
    const csv = headers + rows.join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "relatorio-estoque.csv";
    a.click();
    URL.revokeObjectURL(url);
  }

  function handlePrint() {
    window.print();
  }

  const totalItems = data.reduce((sum: number, r: any) => sum + r.stock, 0);
  const totalValue = data.reduce((sum: number, r: any) => sum + Number(r.price) * r.stock, 0);
  const lowStock = data.filter((r: any) => r.stock <= 5);

  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-stone-200">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-medium text-stone-800">Relatório de Estoque</h2>
        <div className="flex gap-2">
          <button onClick={handleExportCSV} className="border border-stone-300 text-stone-600 px-3 py-2 rounded-lg text-sm hover:bg-stone-50">Exportar CSV</button>
          <button onClick={handlePrint} className="border border-stone-300 text-stone-600 px-3 py-2 rounded-lg text-sm hover:bg-stone-50">Imprimir</button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center p-4 bg-stone-50 rounded-lg">
          <p className="text-2xl font-bold text-stone-800">{data.length}</p>
          <p className="text-xs text-stone-500">Produtos</p>
        </div>
        <div className="text-center p-4 bg-stone-50 rounded-lg">
          <p className="text-2xl font-bold text-stone-800">{totalItems}</p>
          <p className="text-xs text-stone-500">Unidades em estoque</p>
        </div>
        <div className="text-center p-4 bg-stone-50 rounded-lg">
          <p className="text-2xl font-bold text-amber-700">{formatPrice(totalValue)}</p>
          <p className="text-xs text-stone-500">Valor total</p>
        </div>
      </div>

      {lowStock.length > 0 && (
        <div className="mb-4 p-4 bg-red-50 rounded-lg border border-red-200">
          <p className="text-sm font-medium text-red-700">⚠️ {lowStock.length} produto(s) com estoque baixo (≤ 5)</p>
        </div>
      )}

      <table className="w-full text-sm">
        <thead className="bg-stone-50 text-stone-600">
          <tr>
            <th className="text-left px-4 py-3 font-medium">Produto</th>
            <th className="text-left px-4 py-3 font-medium">SKU</th>
            <th className="text-right px-4 py-3 font-medium">Estoque</th>
            <th className="text-right px-4 py-3 font-medium">Preço</th>
            <th className="text-right px-4 py-3 font-medium">Valor total</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-stone-100">
          {data.map((row: any, i: number) => (
            <tr key={i} className={row.stock <= 5 ? "bg-red-50" : ""}>
              <td className="px-4 py-3 font-medium text-stone-800">{row.name}</td>
              <td className="px-4 py-3 text-stone-500">{row.sku || "—"}</td>
              <td className="px-4 py-3 text-right">{row.stock}</td>
              <td className="px-4 py-3 text-right">{formatPrice(row.price)}</td>
              <td className="px-4 py-3 text-right">{formatPrice(Number(row.price) * row.stock)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
