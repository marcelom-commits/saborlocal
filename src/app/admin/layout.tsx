"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <p className="text-stone-500">Carregando...</p>
      </div>
    );
  }

  if (!session || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const links = [
    { href: "/admin", label: "Dashboard" },
    { href: "/admin/produtos", label: "Produtos" },
    { href: "/admin/categorias", label: "Categorias" },
    { href: "/admin/pedidos", label: "Pedidos" },
    { href: "/admin/clientes", label: "Clientes" },
    { href: "/admin/relatorios", label: "Relatórios" },
  ];

  return (
    <div className="min-h-screen bg-stone-100">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/admin" className="font-serif font-bold text-stone-800">
              🍽️ SaborLocal Admin
            </Link>
          </div>
          <Link href="/" className="text-xs text-stone-500 hover:text-stone-700">
            Ver loja
          </Link>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 py-6">
        <nav className="flex gap-1 mb-6 overflow-x-auto">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-4 py-2 rounded-lg text-sm font-medium text-stone-600 hover:bg-white hover:text-stone-800 transition-colors whitespace-nowrap"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        {children}
      </div>
    </div>
  );
}
