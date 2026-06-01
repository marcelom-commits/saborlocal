"use client";

import { useState } from "react";
import { RevenueReport } from "@/components/admin/reports/revenue-report";
import { StockReport } from "@/components/admin/reports/stock-report";

export default function AdminRelatoriosPage() {
  const [tab, setTab] = useState<"revenue" | "stock">("revenue");

  return (
    <div>
      <h1 className="font-serif text-2xl text-stone-800 mb-6">Relatórios</h1>
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab("revenue")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "revenue" ? "bg-amber-700 text-white" : "bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          Faturamento
        </button>
        <button
          onClick={() => setTab("stock")}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            tab === "stock" ? "bg-amber-700 text-white" : "bg-white text-stone-600 hover:bg-stone-50"
          }`}
        >
          Estoque
        </button>
      </div>
      {tab === "revenue" ? <RevenueReport /> : <StockReport />}
    </div>
  );
}
