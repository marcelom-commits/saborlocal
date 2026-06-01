"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export function HeaderUserMenu() {
  const { data: session } = useSession();

  if (session?.user) {
    return (
      <div className="flex items-center gap-3">
        {session.user.role === "ADMIN" && (
          <Link
            href="/admin"
            className="text-xs font-medium text-amber-700 hover:text-amber-800"
          >
            Painel Admin
          </Link>
        )}
        <Link
          href="/conta"
          className="text-xs font-medium text-stone-600 hover:text-stone-800"
        >
          Minha Conta
        </Link>
        <button
          onClick={() => signOut()}
          className="text-xs text-stone-500 hover:text-stone-700"
        >
          Sair
        </button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="text-sm font-medium text-stone-600 hover:text-amber-700 transition-colors"
      >
        Entrar
      </Link>
      <Link
        href="/cadastro"
        className="text-sm font-medium bg-amber-700 text-white px-4 py-2 rounded-lg hover:bg-amber-800 transition-colors"
      >
        Cadastrar
      </Link>
    </div>
  );
}
